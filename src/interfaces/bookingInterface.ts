import { IBooking, IBookingResponse } from "../models/bookingModel";
import { Request, Response } from "express";

export interface PaymentResponse {
    transactionId: string;
    status: 'Success' | 'Failed' | 'Pending';
    amount: number;
    currency: string;
    paymentMethod: string;
    timestamp: Date;
}

export interface IBookingController {
  getBookingList(req: Request, res: Response): Promise<void>;
  getEmployeeBookings(req: Request, res: Response): Promise<void>;
  getBookingDetails(req: Request, res: Response): Promise<void>;
  updateStatus(req: Request, res: Response): Promise<void>;
  cancelBooking(req: Request, res: Response): Promise<void>;
  createBooking(req: Request, res: Response): Promise<Response>;
}

export interface IBookingService {
    getBookingList(userId: string): Promise<IBookingResponse[]>;
    getEmployeeBookings(employeeId: string): Promise<IBookingResponse[]>;
    getBookingDetails(bookingId: string): Promise<IBooking>;
    updateBookingStatus(bookingId: string, bookingStatus?: string, completed?: boolean): Promise<IBooking>;
    refund(paymentId: string, totalAmount: number): Promise<void>;
    cancelBooking(bookingId: string, userId:string, senderModel:string): Promise<string>;
    parseBookingDate(bookingDate: string): Promise<Date>;
    createBooking(
        userId: string,
        serviceId: string,
        addressId: string,
        timeslotId: string,
        paymentMethod: string,
        totalAmount: number,
        paymentResponse: PaymentResponse,
    ): Promise<{ success: boolean; message: string }>;
}

export interface IBookingRepository{
    getBookingList(userId:string): Promise<IBookingResponse[]>;
    getEmployeeBookings(employeeId: string): Promise<IBookingResponse[]>;
    getBookingDetails(bookingId: string): Promise<IBooking>;
    updateBookingStatus(bookingId: string,updateData: Partial<IBooking>): Promise<IBooking | null | undefined>;
}
