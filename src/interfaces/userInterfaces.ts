import { IUser } from "../models/userModel";
import { IAddress } from "../models/addressModel";
import { ITimeslot } from "../models/timeslotModel";
import { ITransaction } from "../models/walletModel";
import { Request, Response } from 'express';
import { ObjectId, Types } from "mongoose";

export interface PaymentResponse {
    transactionId: string;
    status: 'Success' | 'Failed' | 'Pending';
    amount: number;
    currency: string;
    paymentMethod: string;
    timestamp: Date;
}

export interface IUserController {
    signup(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
    resendOtp(req: Request, res: Response): Promise<void>;
    userLogin(req: Request, res: Response): Promise<void>;
    getUserDetails(req: Request, res: Response): Promise<void>;
    getUserTransactions(req: Request, res: Response): Promise<void>;
}

export interface IUserService {
    signup(userData: IUser): Promise<{ status?: number; message: string; otpToken?: string }>;
    generateOtp(): string;
    verifyOtp(otpToken: string, otp: string): Promise<{ message: string }>;
    getUserDetails(userId: string): Promise<IUser>;
    resendOtp(email: string): Promise<{ message: string; newOtpToken?: string }>;
    userLogin(email: string, password: string): Promise<{
        token: string;
        user: {
            email: string;
            id: string;
            username: string;
            is_done: boolean;
        };
        message: string;
    }>;
    getUserTransactions(userId: string): Promise<ITransaction>;
}

export interface IUserRepository {
    createUser(userData: IUser): Promise<IUser>;
    createWallet(userId: string): Promise<void>;
    findUserByEmail(email: string): Promise<IUser>;
    findUserById(userId: string): Promise<IUser>;
    updateUserVerificationStatus(email: string, is_verified: boolean): Promise<void>;
    addAddress(address: string, locality: string, city: string, state: string, pincode: number, user: string, typeOfAddress: string): Promise<IAddress>;
    getAddressByUser(userId: string): Promise<IAddress[]>;
    fetchAddressSelected(addressId: string): Promise<IAddress>;
    updateTimeslot(slotId: string, isbooked: boolean): Promise<{ success: boolean; message: string }>;
    changeTimeslotStatus(slotId: string | ObjectId, isbooked: boolean): Promise<{ success: boolean; message: string }>;
    getTimeslot(slotId: string): Promise<ITimeslot>;
    fetchTimeSlots(employeeId: string, date: string): Promise<ITimeslot[]>;
    createBooking(userId: string, serviceId: string, addressId: string, timeslotId: string, paymentMethod: string, totalAmount: number, paymentResponse: object, bookingStatus: 'Pending' | 'Confirmed' | 'Cancelled',
        paymentStatus: 'Pending' | 'Success' | 'Failed'): Promise<{ success: boolean; message: string }>;
    getUserTransactions(userId: string): Promise<ITransaction>;

}




