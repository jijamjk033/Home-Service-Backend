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
exports.TimeslotService = void 0;
class TimeslotService {
    constructor(userRepository, employeeRepository) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }
    fetchTimeSlots(employeeId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.fetchTimeSlots(employeeId, date);
            }
            catch (error) {
                console.error('Timeslot not fetched');
                throw new Error('Timeslot not found');
            }
        });
    }
    getTimeslotByid(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getTimeslot(slotId);
            }
            catch (error) {
                console.error('Timeslot not fetched');
                throw new Error('Timeslot not found');
            }
        });
    }
    timeslot(employeeId, startDate, endDate, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const generatedSlots = yield this.generateTimeSlots(employeeId, startDate, endDate, startTime, endTime);
                if (generatedSlots.length > 0) {
                    return { message: 'Timeslots created successfully', slots: generatedSlots };
                }
                else {
                    throw new Error('No new timeslots were created (possible overlap with existing slots).');
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error creating time slots:', error.message);
                    throw new Error(error.message);
                }
                else {
                    throw new Error('An unknown error occurred while creating the timeslots');
                }
            }
        });
    }
    generateTimeSlots(employeeId, startDate, endDate, startTime, endTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const slots = [];
            const start = new Date(startDate);
            const end = new Date(endDate);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const date = d.toISOString().slice(0, 10);
                let currentHour = parseInt(startTime.split(':')[0], 10);
                const endHour = parseInt(endTime.split(':')[0], 10);
                while (currentHour < endHour) {
                    const timeSlot = `${date} ${this.formatTime(currentHour)} - ${this.formatTime(currentHour + 1)}`;
                    const exists = yield this.employeeRepository.findSlot(employeeId, date, this.formatTime(currentHour), this.formatTime(currentHour + 1));
                    if (!exists) {
                        yield this.employeeRepository.newTimeslot(employeeId, date, this.formatTime(currentHour), this.formatTime(currentHour + 1));
                        slots.push(timeSlot);
                    }
                    currentHour++;
                }
            }
            return slots;
        });
    }
    formatTime(hour) {
        return hour < 10 ? `0${hour}:00` : `${hour}:00`;
    }
    getTimeSlots(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeSlots = yield this.employeeRepository.findTimeslotById(employeeId);
            if (!timeSlots) {
                throw new Error('Timeslot not found');
            }
            return timeSlots;
        });
    }
    deleteSlotsByEmployeeId(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.employeeRepository.deleteMany(employeeId);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error('Error deleting time slots for the employee: ' + error.message);
                }
            }
        });
    }
    deleteSlotsBySlotId(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.employeeRepository.deleteById(slotId);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error('Error deleting time slot ' + error.message);
                }
            }
        });
    }
}
exports.TimeslotService = TimeslotService;
