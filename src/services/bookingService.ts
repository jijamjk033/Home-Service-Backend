import { IBookingRepository, IBookingService } from "../interfaces/bookingInterface";
import { IServiceRepository } from "../interfaces/serviceInterface";
import { IUserRepository, PaymentResponse } from "../interfaces/userInterfaces";
import { IBooking } from "../models/bookingModel";
import { bookingRepository } from "../repositories/bookingrepository";
import { notificationRepository } from "../repositories/notificationRepository";
import { serviceRepository } from "../repositories/serviceRepository";
import { UserRepository } from "../repositories/userRepository";

class BookingService implements IBookingService {
    private bookingRepository: IBookingRepository;
    private userRepository: IUserRepository;
    private serviceRepository: IServiceRepository;
    constructor(bookingRepository: IBookingRepository, UserRepository: IUserRepository, serviceRepository: IServiceRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = UserRepository;
        this.serviceRepository = serviceRepository;
    }

    async getBookingList(userId: string) {
        try {
            const user = await this.userRepository.findUserById(userId);
            if (!user) throw new Error('User does not exists');
            const bookingdata = await this.bookingRepository.getBookingList(userId);
            return bookingdata;
        } catch (error) {
            console.error('Booking data not found');
            throw new Error('Error fetching Booking Data');
        }
    }

    async getEmployeeBookings(employeeId: string) {
        try {
            const bookingdata = await this.bookingRepository.getEmployeeBookings(employeeId);

            return bookingdata;
        } catch (error) {
            console.error('Booking data not found');
            throw new Error('Error fetching Booking Data');
        }
    }

    async getBookingDetails(bookingId: string) {
        try {
            const bookingdata = await this.bookingRepository.getBookingDetails(bookingId);
            return bookingdata;
        } catch (error) {
            console.error('Booking data not found');
            throw new Error('Error fetching Booking Data');
        }
    }

    async updateBookingStatus(bookingId: string, bookingStatus?: string, completed?: boolean): Promise<IBooking> {
        try {
            if (!bookingId) throw new Error('Booking ID is required');

            const updateData: Partial<IBooking> = {};
            if (bookingStatus && ['Pending', 'Confirmed', 'Cancelled'].includes(bookingStatus)) {
                updateData.bookingStatus = bookingStatus as 'Pending' | 'Confirmed' | 'Cancelled';
            } else if (bookingStatus) {
                throw new Error('Invalid booking status');
            }

            if (typeof completed !== 'undefined') {
                updateData.completed = completed;
            }

            if (bookingStatus === 'Cancelled') {
                const booking = await this.bookingRepository.getBookingDetails(bookingId);
                if (!booking) throw new Error('Booking not found');
                await this.userRepository.changeTimeslotStatus(booking.timeslotId, false);
                if (booking.paymentMethod === 'Online' && booking.paymentResponse?.paymentId) {
                    await this.refund(booking.paymentResponse.paymentId, booking.totalAmount ?? 0);
                }
            }
            const updatedBooking = await this.bookingRepository.updateBookingStatus(bookingId, updateData);
            if (!updatedBooking) {
                throw new Error('Failed to update booking status');
            }
            return updatedBooking;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error updating booking status: ${error.message}`);
            }
            throw error;
        }
    }

    async refund(paymentId: string, totalAmount: number): Promise<void> {
        try {
            if (!paymentId || !totalAmount) {
                throw new Error('Payment ID and amount are required for refund');
            }
            console.log(`Processing refund for Payment ID: ${paymentId}, Amount: ${totalAmount}`);
            return Promise.resolve();
        } catch (error) {
            if (error instanceof Error)
                throw new Error(`Error processing refund: ${error.message}`);
        }
    }

    async cancelBooking(bookingId: string, senderId: string, senderModel: 'User' | 'Employee') {
        try {
            const booking = await this.bookingRepository.getBookingDetails(bookingId);
            if (!booking) throw new Error('Booking not found');
            if (booking.bookingStatus === 'Completed' || booking.bookingStatus === 'Cancelled') {
                throw new Error('Booking cannot be cancelled');
            }
            const currentTime = new Date();
            const slotDate = await this.parseBookingDate(booking.date);
            const timeDifferenceInHours = (slotDate.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
            let refundAmount = 0;
            console.log('details-->', currentTime, booking.date, slotDate, timeDifferenceInHours);
            if (timeDifferenceInHours > 24) {
                refundAmount = senderModel === 'User' ? booking.totalAmount - 50 : booking.totalAmount;
            } else if (timeDifferenceInHours >= 12 && timeDifferenceInHours <= 24) {
                refundAmount = 0;
            } else {
                throw new Error('Booking cannot be cancelled within 12 hours of the slot');
            }
            await bookingRepository.updateBookingStatus(bookingId, { bookingStatus: 'Cancelled' });
            if (refundAmount > 0) {
                const walletCreated = await userRepository.addTransactionToWallet(
                    booking.userId,
                    refundAmount,
                    'credit'
                );
                console.log('wallet', walletCreated);
            }
            await userRepository.changeTimeslotStatus(booking.timeslotId, false);
            // const recipientId = senderModel === 'User' ? booking.employee : booking.userId;
            // const recipientModel = senderModel === 'User' ? 'Employee' : 'User';
            // const message = senderModel === 'User'
            //     ? `Your timeslot has been cancelled by the user. Booking ID: ${bookingId}.`
            //     : `Your booking has been cancelled by the employee. Booking ID: ${bookingId}. Refund of ₹${refundAmount} has been processed.`;
            // const notificationType = 'cancellation';
            // await notificationRepository.createNotification(senderId, senderModel, recipientId, recipientModel, message, notificationType);
            return `Booking cancelled successfully. Refund of ₹${refundAmount} has been processed.`;
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Error cancelling booking: ${error.message}`);
                throw new Error(`Error cancelling booking: ${error.message}`);
            }
            throw new Error('An unexpected error occurred during cancellation.');
        }
    }

    async parseBookingDate(bookingDate: string) {
        const [monthDay, timeRange] = bookingDate.split(' - ');
        const [startTime] = timeRange.split(' to ');
        const year = new Date().getFullYear();
        const dateString = `${monthDay} ${year} ${startTime}`;
        const parsedDate = new Date(dateString);
        if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date format');
        }
        return parsedDate;
    };

    async createBooking(
        userId: string,
        serviceId: string,
        addressId: string,
        timeslotId: string,
        paymentMethod: string,
        totalAmount: number,
        paymentResponse: PaymentResponse
    ) {
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
                paymentStatus = 'Pending';
            } else if (paymentMethod === 'online' || paymentMethod === 'wallet') {
                paymentStatus = paymentResponse.status;
            }
            const bookingResult = await this.userRepository.createBooking(
                userId,
                serviceId,
                addressId,
                timeslotId,
                paymentMethod,
                totalAmount,
                paymentResponse,
                bookingStatus,
                paymentStatus
            );

            if (!bookingResult.success) {
                throw new Error(bookingResult.message);
            }
            await this.userRepository.updateTimeslot(timeslotId, true);

            return bookingResult;
        } catch (error) {
            console.error("Booking creation error:", error);
            throw new Error(error instanceof Error ? error.message : "Booking creation failed");
        }
    }
}

const userRepository = new UserRepository();
export const bookingService = new BookingService(bookingRepository, userRepository, serviceRepository);