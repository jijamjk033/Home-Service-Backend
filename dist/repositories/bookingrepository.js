"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookingModel_1 = require("../models/bookingModel");
class BookingRepository {
    getBookingList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield bookingModel_1.Booking.find({ userId: new mongoose_1.default.Types.ObjectId(userId) })
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
                    var _a, _b;
                    const timeslot = booking.timeslotId;
                    const service = booking.serviceId;
                    return {
                        _id: booking._id,
                        employee: ((_a = timeslot === null || timeslot === void 0 ? void 0 : timeslot.employeeId) === null || _a === void 0 ? void 0 : _a.name) || '',
                        date: this.formatDate(timeslot === null || timeslot === void 0 ? void 0 : timeslot.date, timeslot === null || timeslot === void 0 ? void 0 : timeslot.startTime, timeslot === null || timeslot === void 0 ? void 0 : timeslot.endTime),
                        category: ((_b = service === null || service === void 0 ? void 0 : service.category) === null || _b === void 0 ? void 0 : _b.name) || '',
                        service: (service === null || service === void 0 ? void 0 : service.name) || '',
                        totalAmount: booking.totalAmount || 0,
                        paymentMethod: booking.paymentMethod,
                        bookingStatus: booking.bookingStatus,
                        completed: booking.completed,
                    };
                });
            }
            catch (error) {
                console.error('Error fetching booking list:', error);
                throw error;
            }
        });
    }
    getEmployeeBookings(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield bookingModel_1.Booking.aggregate([
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
                            'timeslot.employeeId': new mongoose_1.default.Types.ObjectId(employeeId),
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
            }
            catch (error) {
                console.error('Error fetching booking list:', error);
                throw error;
            }
        });
    }
    formatDate(date, startTime, endTime) {
        const options = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        };
        return date
            ? `${new Date(date).toLocaleDateString('en-US', options)}, ${startTime || ''} - ${endTime || ''}`
            : '';
    }
    getBookingDetails(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingDetails = yield bookingModel_1.Booking.aggregate([
                    {
                        $match: { _id: new mongoose_1.default.Types.ObjectId(bookingId) },
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
            }
            catch (error) {
                console.error('Error fetching booking details:', error);
                throw error;
            }
        });
    }
    updateBookingStatus(bookingId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield bookingModel_1.Booking.findByIdAndUpdate(bookingId, updateData, { new: true }).lean();
                console.log(result);
                if (!result) {
                    return null;
                }
                return result;
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Error(`Error updating booking in database: ${error.message}`);
            }
        });
    }
}
exports.bookingRepository = new BookingRepository();
