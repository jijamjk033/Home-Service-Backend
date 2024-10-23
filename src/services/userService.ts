import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { otpService } from "../helpers/otpService";

const OTP_EXPIRY_TIME = 60;
const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';
import { StatusCodes } from 'http-status-codes';
import { IUserRepository } from '../interfaces/userInterfaces';
import { IUser } from '../models/userModel';

export class UserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
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

    async addAddress(address:string, locality:string,city:string, state:string, pincode:number, user:string, typeOfAddress:string) {
        try {
            const result = await this.userRepository.addAddress(address, locality,city, state, pincode, user, typeOfAddress);
            return result;
        } catch (error) {
            console.error('Error in service layer:', error);
            throw new Error('Could not save address.');
        }
    }

    async getAddressByUser(userId:string){
        return await this.userRepository.getAddressByUser(userId);
    }
}
