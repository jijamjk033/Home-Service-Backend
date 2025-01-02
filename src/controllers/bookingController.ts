import { Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';
import { bookingService } from "../services/bookingService";
import { IBookingController, IBookingService } from "../interfaces/bookingInterface";

class BookingController implements IBookingController {
      
    async getBookingList(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const bookingData = await bookingService.getBookingList(userId);
            
            res.status(StatusCodes.OK).json({
                status: 'Success',
                data: bookingData,
                message: ' Booking Data fetched successfully'
            })
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Error fetching Booking data', err,
            })
        }
    }

    async getEmployeeBookings(req: Request, res: Response){
        try {
            const employeeId = req.params.id;
            const bookingData = await bookingService.getEmployeeBookings(employeeId);
            res.status(StatusCodes.OK).json({
                status: 'Success',
                data: bookingData,
                message: ' Booking Data fetched successfully'
            })
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Error fetching Booking data', err,
            })
        }
    }

    async getBookingDetails(req: Request, res: Response) {
        try {
            const bookingId = req.params.id;
            const bookingData = await bookingService.getBookingDetails(bookingId);
            res.status(StatusCodes.OK).json({
                status: 'Success',
                data: bookingData,
                message: ' Booking Data fetched successfully'
            })
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Error fetching Booking data', err,
            })
        }

    }

    async updateStatus(req: Request, res: Response) {
        try {
            const bookingId = req.params.id;
            const { bookingStatus, completed } = req.body;
            const updatedBooking = await bookingService.updateBookingStatus(bookingId, bookingStatus, completed);
            res.status(StatusCodes.OK).json({
                status: 'Success',
                data: updatedBooking,
                message: 'Booking status updated successfully',
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Error updating booking status',
                error,
            });
        }
    }
    
    async cancelBooking(req: Request, res: Response) {
        try {
            const bookingId = req.params.id;
            const senderId = req.body.data.senderId;
            const senderModel = req.body.data.senderModel;
            const result = await bookingService.cancelBooking(bookingId, senderId, senderModel);
            res.status(StatusCodes.OK).json({
                status: 'Success',
                data: result,
                message: 'Booking cancellation successful',
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Error cancelling booking',
                error,
            });
        }
    }

    async createBooking(req: Request, res: Response) {
        const { userId, serviceId, addressId, timeslotId, paymentMethod, totalAmount, paymentResponse } = req.body;
        console.log(paymentMethod, 'payment initiated');
        try {
            const response = await bookingService.createBooking(userId, serviceId, addressId, timeslotId, paymentMethod, totalAmount, paymentResponse);
            return res.status(StatusCodes.OK).json({
                message: response.message || 'Booking successfull',
                success: response.success,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unknown error occurred';
            return res.status(StatusCodes.BAD_REQUEST).json({
                message,
                success: false,
            });
        }
    }
}

export const bookingController = new BookingController()