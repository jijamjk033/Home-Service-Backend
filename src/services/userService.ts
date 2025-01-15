import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { otpService } from "../helpers/otpService";
import { StatusCodes } from 'http-status-codes';
import { IUserRepository, IUserService } from '../interfaces/userInterfaces';
import { IUser } from '../models/userModel';
const OTP_EXPIRY_TIME = 60;
const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESHSECRET || 'myjwtRefreshsecret';

export class UserService implements IUserService{
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
        await this.userRepository.createWallet(userData._id);

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

    async getUserDetails(userId: string) {
        try {
            const userDetails = await this.userRepository.findUserById(userId);
            return userDetails;
        } catch (err) {
            console.error('Address not fetched');
            throw new Error('Address not found');
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
        const token = jwt.sign({ email: user.email, id: user._id,role: 'user' }, JWT_SECRET, { expiresIn: '10h' });
        const refreshToken = jwt.sign(
            { email: user.email, id: user._id },
            JWT_REFRESH_SECRET,
            { expiresIn: '7d' } 
        );
        await this.userRepository.updateUser(user._id, { refreshToken: refreshToken });
        return {
            token, refreshToken, user: { email: user.email, id: user._id, username: user.name, is_done: user.is_verified },
            message: 'Login successful'
        }
    }

    async getUserTransactions(userId: string){
        try{
            return await this.userRepository.getUserTransactions(userId);
        }catch(error){
            console.error('Transactions fetching failed');
            throw new Error('Error fetching transactions')
        }
    }

}
