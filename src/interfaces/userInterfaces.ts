import { IUser } from "../models/userModel";
import { IAddress } from "../models/addressModel";
import { ITimeslot } from "../models/timeslotModel";

export interface IUserRepository {
    createUser(userData: IUser): Promise<IUser>;
    findUserByEmail(email: string): Promise<IUser>;
    findUserById(userId: string): Promise<IUser>;
    updateUserVerificationStatus(email: string, is_verified: boolean): Promise<void>;
    addAddress(address: string, locality: string, city: string, state: string, pincode: number, user: string, typeOfAddress: string): Promise<IAddress>;
    getAddressByUser(userId: string): Promise<IAddress[]>;
    fetchAddressSelected(addressId: string): Promise<IAddress>;
    bookTimeslot(slotId: string, isbooked: boolean): Promise<{ success: boolean; message: string }>;
    getTimeslot(slotId: string): Promise<ITimeslot>;
    fetchTimeSlots(employeeId: string, date: string): Promise<ITimeslot[]>;
    createBooking(userId: string, serviceId: string, addressId: string, timeslotId: string, paymentMethod: string, paymentResponse: object, bookingStatus: 'Pending' | 'Confirmed' | 'Cancelled',
        paymentStatus: 'Pending' | 'Success' | 'Failed'): Promise<{ success: boolean; message: string }>;
}

export interface PaymentResponse {
    transactionId: string;
    status: 'Success' | 'Failed' | 'Pending';
    amount: number;
    currency: string;
    paymentMethod: string;
    timestamp: Date;
}
