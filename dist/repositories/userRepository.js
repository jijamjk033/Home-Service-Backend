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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const addressModel_1 = require("../models/addressModel");
const bookingModel_1 = require("../models/bookingModel");
const timeslotModel_1 = require("../models/timeslotModel");
const userModel_1 = require("../models/userModel");
class UserRepository {
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new userModel_1.User(userData);
            const savedUser = yield user.save();
            return savedUser.toObject();
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.User.findOne({ email: email });
            if (!user) {
                return null;
            }
            return user;
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.User.findOne({ _id: userId });
            if (!user) {
                return null;
            }
            return user;
        });
    }
    updateUserVerificationStatus(email, is_verified) {
        return __awaiter(this, void 0, void 0, function* () {
            const statusUpdate = is_verified ? 'active' : 'inactive';
            yield userModel_1.User.updateOne({ email }, { is_verified, status: statusUpdate });
        });
    }
    addAddress(address, locality, city, state, pincode, user, typeOfAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAddress = new addressModel_1.addressModel({
                address,
                locality,
                city,
                state,
                pincode,
                user,
                typeOfAddress
            });
            const savedAddress = yield newAddress.save();
            return savedAddress.toObject();
        });
    }
    getAddressByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addresses = yield addressModel_1.addressModel.find({ user: userId }).lean();
                return addresses;
            }
            catch (error) {
                throw new Error('Error fetching addresses from the database');
            }
        });
    }
    fetchAddressSelected(addresId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const address = yield addressModel_1.addressModel.find({ _id: addresId }).lean();
                return address;
            }
            catch (error) {
                throw new Error('Error fetching addresses from the database');
            }
        });
    }
    fetchTimeSlots(employeeId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timeslotsFetched = yield timeslotModel_1.timeslots.find({ employeeId: employeeId, date: date, isBooked: false }, { employeeId: 1, date: 1, startTime: 1, endTime: 1, isBooked: 1 }).lean();
                return timeslotsFetched;
            }
            catch (error) {
                throw new Error('Error fetching timeslots from the database');
            }
        });
    }
    getTimeslot(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timeslot = yield timeslotModel_1.timeslots.findOne({ _id: slotId }).lean();
                return timeslot;
            }
            catch (error) {
                throw new Error('Error fetching timeslot from the database');
            }
        });
    }
    createBooking(userId, serviceId, addressId, timeslotId, paymentMethod, paymentResponse, bookingStatus, paymentStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newBooking = new bookingModel_1.Booking({
                    userId,
                    serviceId,
                    addressId,
                    timeslotId,
                    paymentMethod,
                    paymentResponse,
                    bookingStatus,
                    paymentStatus
                });
                const savedBooking = yield newBooking.save();
                return { success: true, message: 'Booking created successfully', booking: savedBooking };
            }
            catch (error) {
                console.error("Booking creation failed:", error);
                return { success: false, message: `Booking creation failed: ${error instanceof Error ? error.message : "Unknown error"}` };
            }
        });
    }
    bookTimeslot(slotId, booking) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const slot = yield timeslotModel_1.timeslots.findById(slotId);
                if (slot && slot.isBooked) {
                    throw new Error('Slot is already booked');
                }
                const updateResult = yield timeslotModel_1.timeslots.updateOne({ _id: slotId }, { isBooked: booking });
                if (updateResult.modifiedCount === 0) {
                    throw new Error('Failed to update slot booking status');
                }
                return { success: true, message: 'Slot booked successfully' };
            }
            catch (error) {
                console.error('Booking failed:', error);
                throw new Error(error instanceof Error ? error.message : 'Slot booking failed');
            }
        });
    }
}
exports.UserRepository = UserRepository;
