import mongoose from "mongoose";
import { IBookingRepository } from "../interfaces/bookingInterface";
import { Booking, IBooking } from "../models/bookingModel";

class BookingRepository {
    async getBookingList(userId: string) {
        try {
            const bookings = await Booking.find({ userId: new mongoose.Types.ObjectId(userId) })
                .populate({
                    path: 'serviceId',
                    select: 'name category',
                    populate: { path: 'category', select: 'name' },
                })
                .populate({
                    path: 'timeslotId',
                    select: 'date startTime endTime',
                    populate: { path: 'employeeId', select: 'name' },
                })
                .populate('addressId', 'addressLine1 city')
                .select('serviceId timeslotId totalAmount paymentMethod bookingStatus completed');

            return bookings.map((booking) => {
                const timeslot = booking.timeslotId as unknown as {
                    date: Date;
                    startTime: string;
                    endTime: string;
                    employeeId: { name: string } | null;
                } | null;

                const service = booking.serviceId as unknown as {
                    name: string;
                    category: { name: string };
                } | null;
                return {
                    _id: booking._id,
                    employee: timeslot?.employeeId?.name || '',
                    date: this.formatDate(timeslot?.date, timeslot?.startTime, timeslot?.endTime),
                    category: service?.category?.name || '',
                    service: service?.name || '',
                    totalAmount: booking.totalAmount || 0,
                    paymentMethod: booking.paymentMethod,
                    bookingStatus: booking.bookingStatus,
                    completed: booking.completed,
                };
            });
        } catch (error) {
            console.error('Error fetching booking list:', error);
            throw error;
        }
    }

    async getEmployeeBookings(employeeId: string) {
        try {
            const bookings = await Booking.aggregate([
                {
                    $lookup: {
                        from: 'timeslots',
                        localField: 'timeslotId',
                        foreignField: '_id',
                        as: 'timeslot',
                    },
                },
                { $unwind: '$timeslot' },
                {
                    $match: {
                        'timeslot.employeeId': new mongoose.Types.ObjectId(employeeId),
                    },
                },
                {
                    $lookup: {
                        from: 'services',
                        localField: 'serviceId',
                        foreignField: '_id',
                        as: 'service',
                    },
                },
                { $unwind: '$service' },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'service.category',
                        foreignField: '_id',
                        as: 'serviceCategory',
                    },
                },
                { $unwind: '$serviceCategory' },
                {
                    $lookup: {
                        from: 'addresses',
                        localField: 'addressId',
                        foreignField: '_id',
                        as: 'address',
                    },
                },
                { $unwind: { path: '$address', preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user',
                    },
                },
                { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

                {
                    $project: {
                        _id: 1,
                        userName: '$user.name',
                        service: '$service.name',
                        category: '$serviceCategory.name',
                        employee: '$timeslot.employeeId',
                        date: '$timeslot.date',
                        startTime: '$timeslot.startTime',
                        endTime: '$timeslot.endTime',
                        totalAmount: 1,
                        paymentMethod: 1,
                        bookingStatus: 1,
                        completed: 1,
                        address: { $concat: ['$address.address', ', ', '$address.locality', ', ', '$address.city'] },
                    },
                },
            ]);

            return bookings.map((booking) => ({
                _id: booking._id,
                userName: booking.userName || '',
                employee: booking.employee,
                date: this.formatDate(booking.date, booking.startTime, booking.endTime),
                category: booking.category || '',
                service: booking.service || '',
                totalAmount: booking.totalAmount || 0,
                paymentMethod: booking.paymentMethod,
                bookingStatus: booking.bookingStatus,
                completed: booking.completed,
                address: booking.address || '',
            }));
        } catch (error) {
            console.error('Error fetching booking list:', error);
            throw error;
        }
    }


    private formatDate(date: Date | undefined, startTime: string | undefined, endTime: string | undefined): string {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        };
        return date
            ? `${new Date(date).toLocaleDateString('en-US', options)}, ${startTime || ''} - ${endTime || ''}`
            : '';
    }

    async getBookingDetails(bookingId: string) {
        try {
            const bookingDetails = await Booking.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(bookingId) },
                },
                {
                    $lookup: {
                        from: 'services',
                        localField: 'serviceId',
                        foreignField: '_id',
                        as: 'serviceDetails',
                    },
                },
                {
                    $unwind: { path: '$serviceDetails', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'serviceDetails.category',
                        foreignField: '_id',
                        as: 'categoryDetails',
                    },
                },
                {
                    $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'timeslots',
                        localField: 'timeslotId',
                        foreignField: '_id',
                        as: 'timeslotDetails',
                    },
                },
                {
                    $unwind: { path: '$timeslotDetails', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'employees',
                        localField: 'timeslotDetails.employeeId',
                        foreignField: '_id',
                        as: 'employeeDetails',
                    },
                },
                {
                    $unwind: { path: '$employeeDetails', preserveNullAndEmptyArrays: true },
                },
                {
                    $lookup: {
                        from: 'addresses',
                        localField: 'addressId',
                        foreignField: '_id',
                        as: 'addressDetails',
                    },
                },
                {
                    $unwind: { path: '$addressDetails', preserveNullAndEmptyArrays: true },
                },
                {
                    $addFields: {
                        'timeslotDetails.date': {
                            $convert: {
                                input: '$timeslotDetails.date',
                                to: 'date',
                                onError: null,
                                onNull: null,
                            },
                        },
                    },
                },
                {
                    $addFields: {
                        formattedDate: {
                            $concat: [
                                {
                                    $arrayElemAt: [
                                        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                                        { $subtract: [{ $dayOfWeek: '$timeslotDetails.date' }, 1] },
                                    ],
                                },
                                ', ',
                                { $dateToString: { format: '%b %d', date: '$timeslotDetails.date' } },
                                ' - ',
                                '$timeslotDetails.startTime',
                                ' to ',
                                '$timeslotDetails.endTime',
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        employee: '$employeeDetails.name',
                        date: '$formattedDate',
                        service: '$serviceDetails.name',
                        serviceImage: '$serviceDetails.image',
                        category: '$categoryDetails.name',
                        totalAmount: 1,
                        paymentMethod: 1,
                        paymentStatus: 1,
                        bookingStatus: 1,
                        timeslotId: 1,
                        userId: 1,
                        completed: 1,
                        address: {
                            line1: '$addressDetails.addressLine1',
                            city: '$addressDetails.city',
                        },
                    },
                },
            ]);

            if (!bookingDetails.length) {
                throw new Error('Booking not found');
            }

            return bookingDetails[0];
        } catch (error) {
            console.error('Error fetching booking details:', error);
            throw error;
        }
    }

    async updateBookingStatus(bookingId: string, updateData: Partial<IBooking>) {
        try {
            const result = await Booking.findByIdAndUpdate(bookingId, updateData, { new: true }).lean();
            console.log(result);
            
            if (!result) {
                return null;
            }
            return result as unknown as IBooking;
        } catch (error) {
            if (error instanceof Error)
                throw new Error(`Error updating booking in database: ${error.message}`);
        }
    }

}

export const bookingRepository = new BookingRepository()