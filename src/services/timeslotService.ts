import { IEmployeeRepository } from "../interfaces/employeeInterface";
import { ITimeslotService } from "../interfaces/timeslotInterface";
import { IUserRepository } from "../interfaces/userInterfaces";

export class TimeslotService implements ITimeslotService{
    
    private userRepository: IUserRepository;
    private employeeRepository: IEmployeeRepository
    constructor(userRepository: IUserRepository, employeeRepository: IEmployeeRepository) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }

    async fetchTimeSlots(employeeId: string, date: string) {
        try {
            return await this.userRepository.fetchTimeSlots(employeeId, date);
        } catch (error) {
            console.error('Timeslot not fetched');
            throw new Error('Timeslot not found')
        }
    }

    async getTimeslotByid(slotId: string) {
        try {
            return await this.userRepository.getTimeslot(slotId);
        } catch (error) {
            console.error('Timeslot not fetched');
            throw new Error('Timeslot not found')
        }
    }

    async timeslot(employeeId: string, startDate: string, endDate: string, startTime: string, endTime: string) {
        try {
            const generatedSlots = await this.generateTimeSlots(employeeId, startDate, endDate, startTime, endTime);

            if (generatedSlots.length > 0) {
                return { message: 'Timeslots created successfully', slots: generatedSlots };
            } else {
                throw new Error('No new timeslots were created (possible overlap with existing slots).');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error creating time slots:', error.message);
                throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred while creating the timeslots');
            }
        }
    }

    async generateTimeSlots(employeeId: string, startDate: string, endDate: string, startTime: string, endTime: string) {
        const slots: string[] = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const date = d.toISOString().slice(0, 10);
            let currentHour = parseInt(startTime.split(':')[0], 10);
            const endHour = parseInt(endTime.split(':')[0], 10);

            while (currentHour < endHour) {
                const timeSlot = `${date} ${this.formatTime(currentHour)} - ${this.formatTime(currentHour + 1)}`;
                const exists = await  this.employeeRepository .findSlot(employeeId, date, this.formatTime(currentHour), this.formatTime(currentHour + 1));
                if (!exists) {
                    await  this.employeeRepository .newTimeslot(employeeId, date, this.formatTime(currentHour), this.formatTime(currentHour + 1));
                    slots.push(timeSlot);
                }
                currentHour++;
            }
        }
        return slots;
    }

    formatTime(hour: number): string {
        return hour < 10 ? `0${hour}:00` : `${hour}:00`;
    }

    async getTimeSlots(employeeId: string) {
        const timeSlots = await  this.employeeRepository.findTimeslotById(employeeId);
        if (!timeSlots) {
            throw new Error('Timeslot not found');
        }
        return timeSlots;
    }

    async deleteSlotsByEmployeeId(employeeId: string) {
        try {
            return await  this.employeeRepository.deleteMany(employeeId);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error deleting time slots for the employee: ' + error.message);
            }
        }
    }

    async deleteSlotsBySlotId(slotId: string) {
        try {
            return await  this.employeeRepository .deleteById(slotId);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error('Error deleting time slot ' + error.message);
            }
        }
    }

}