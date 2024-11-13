import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { otpService } from "../helpers/otpService";

const OTP_EXPIRY_TIME = 60;
const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';
import { StatusCodes } from 'http-status-codes';
import { IUserRepository, PaymentResponse } from '../interfaces/userInterfaces';
import { IUser } from '../models/userModel';
import { IServiceRepository } from '../interfaces/serviceInterface';

export class UserService {
    private userRepository: IUserRepository;
    private serviceRepository: IServiceRepository;

    constructor(userRepository: IUserRepository, serviceRepository: IServiceRepository) {
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }

    async signup(userData: IUser) {
        const existingUser = await this.userRepository.findUserByEmail(userData.email);
        if (existingUser) {
            return { status: StatusCodes.BAD_REQUEST, message: 'This user already exists' };
        }

        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);

        const user = await this.userRepository.createUser({ ...userData, is_verified: false });

        const otp = this.generateOtp();
        await otpService.sendOtp(user.email, otp);
        console.log(otp, ': is your OTP');

        const otpToken = jwt.sign({ email: user.email, otp }, JWT_SECRET, { expiresIn: OTP_EXPIRY_TIME });

        return { message: 'Otp sent to your email', otpToken };
    }

    generateOtp() {
        const randomNumber = crypto.randomInt(0, 10000);
        return String(randomNumber).padStart(4, '0');
    }

    async verifyOtp(otpToken: string, otp: string) {
        try {
            const decoded: any = jwt.verify(otpToken, JWT_SECRET);
            const email = decoded.email;
            const storedOtp = decoded.otp;
            if (storedOtp !== otp) {
                throw new Error('Otp invalid');
            }
            await this.userRepository.updateUserVerificationStatus(email, true);
            return { message: 'User verified successfully' };
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new Error('Otp expired');
            } else if (err instanceof jwt.JsonWebTokenError) {
                console.error('Invalid JWT:', err.message);
                throw new Error('Invalid token');
            } else {
                console.error('Unknown error during JWT verification:', err);
                throw err;
            }
        }

    }

    async resendOtp(email: string) {
        try {
            const user = await this.userRepository.findUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            if (user.is_verified) {
                throw new Error('User already verified');
            }
            const otp = this.generateOtp();
            await otpService.sendOtp(email, otp);
            console.log('your otp is:', otp);
            const newOtpToken = jwt.sign({ email, otp }, JWT_SECRET, { expiresIn: OTP_EXPIRY_TIME });
            return { message: 'Otp sent to your email', newOtpToken };
        } catch (err) {
            throw new Error('Unknown error occured');
        }
    }


    async userLogin(email: string, password: string) {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error('User does not exists')
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new Error('Invalid password')
        }
        if (!user.is_verified) {
            throw new Error('User is not verified')
        }
        if (user.isAdmin) {
            throw new Error('Not a user')
        }
        const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, { expiresIn: '10h' });
        return {
            token, user: { email: user.email, id: user._id, username: user.name, is_done: user.is_verified },
            message: 'User login successful'
        }
    }

    async addAddress(address: string, locality: string, city: string, state: string, pincode: number, user: string, typeOfAddress: string) {
        try {
            const result = await this.userRepository.addAddress(address, locality, city, state, pincode, user, typeOfAddress);
            return result;
        } catch (error) {
            console.error('Error in service layer:', error);
            throw new Error('Could not save address.');
        }
    }

    async getAddressByUser(userId: string) {
        try {
            return await this.userRepository.getAddressByUser(userId);
        } catch (error) {
            console.error('Address not fetched');
            throw new Error('Address not found')
        }
    }

    async fetchAddressSelected(addresId: string) {
        try {
            return await this.userRepository.fetchAddressSelected(addresId);
        } catch (error) {
            console.error('Address not fetched');
            throw new Error('Address not found')
        }
    }

    async fetchTimeSlots(employeeId: string, date: string) {
        try {
            return await this.userRepository.fetchTimeSlots(employeeId, date);
        } catch (error) {
            console.error('Timeslot not fetched');
            throw new Error('Timeslot not found')
        }
    }

    async getTimeslots(slotId: string) {
        try {
            return await this.userRepository.getTimeslot(slotId);
        } catch (error) {
            console.error('Timeslot not fetched');
            throw new Error('Timeslot not found')
        }
    }

    async createBooking(userId: string, serviceId: string, addressId: string, timeslotId: string, paymentMethod: string, paymentResponse: PaymentResponse) {
        try {
            const user = await this.userRepository.findUserById(userId);
            if (!user) throw new Error("User not found");
    
            const service = await this.serviceRepository.findByServiceId(serviceId);
            if (!service) throw new Error("Service not found");
    
            const addresses = await this.userRepository.getAddressByUser(userId);
            const validAddress = addresses.find(address => address._id.toString() === addressId);
            if (!validAddress) throw new Error("Address not found or does not belong to the user");
    
            const timeslot = await this.userRepository.getTimeslot(timeslotId);
            if (!timeslot) throw new Error("Timeslot not found");
            if (timeslot.isBooked) throw new Error("Timeslot is already booked");
    
            let bookingStatus: 'Pending' | 'Confirmed' | 'Cancelled' = 'Pending';
            let paymentStatus: 'Pending' | 'Success' | 'Failed' = 'Pending';
    
            if (paymentMethod === 'cash') {
                bookingStatus = 'Confirmed';
                paymentStatus = 'Pending';
            } else if (paymentMethod === 'online' || paymentMethod === 'wallet') {
                paymentStatus = paymentResponse.status === 'Success' ? 'Success' : 'Failed';
                bookingStatus = paymentStatus === 'Success' ? 'Confirmed' : 'Pending';
            }
    
            const bookingResult = await this.userRepository.createBooking(
                userId,
                serviceId,
                addressId,
                timeslotId,
                paymentMethod,
                paymentResponse || {},
                bookingStatus,
                paymentStatus,
            );
    
            if (!bookingResult.success) {
                throw new Error(bookingResult.message);
            }
    
            if (bookingStatus === 'Confirmed') {
                await this.userRepository.bookTimeslot(timeslotId, true);
            }
    
            return bookingResult;
        } catch (error) {
            console.error("Booking creation error:", error);
            throw new Error(error instanceof Error ? error.message : "Booking creation failed");
        }
    }
    
}
