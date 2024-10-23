import { employeeRepository } from "../repositories/employeeRepository";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { otpService } from "../helpers/otpService";
import { IEmployeeRepository } from "../interfaces/employeeInterface";


const OTP_EXPIRY_TIME = 30;
const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';

class EmployeeService {
    private employeeRepository: IEmployeeRepository;

    constructor(employeeRepository: IEmployeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    async signup(employeeData: any) {
        const existingEmployee = await  this.employeeRepository.findEmployeeByEmail(employeeData.email);
        if (existingEmployee) {
            return { status: 400, message: 'This user already exists' };
        }
        const salt = await bcrypt.genSalt(10);
        employeeData.password = await bcrypt.hash(employeeData.password, salt);
        const employee = await  this.employeeRepository.createEmployee({ ...employeeData, is_verified: false });
        const otp = this.generateOtp();
        await otpService.sendOtp(employee.email, otp);
        console.log(otp, ': is your OTP');
        const otpToken = jwt.sign({ email: employee.email, otp }, JWT_SECRET, { expiresIn: OTP_EXPIRY_TIME });
        return { message: 'Otp sent to your email', otpToken };
    }

    generateOtp() {
        const randomNumber = crypto.randomInt(0, 10000);
        return String(randomNumber).padStart(4, '0');
    }

    async verifyOtp(otpToken: string, otp: string) {
        try {
            const decoded: any = jwt.verify(otpToken, JWT_SECRET);
            const email = decoded.email;
            const storedOtp = decoded.otp;

            if (storedOtp !== otp) {
                console.error('OTP mismatch:', { storedOtp, receivedOtp: otp });
                throw new Error('Otp invalid');
            }
            await  this.employeeRepository.updateEmployeeVerificationStatus(email, true);
            return { message: 'Employee verified successfully' };

        } catch (err: any) {
            if (err instanceof jwt.TokenExpiredError) {
                console.error('Token expired:', err.message);
                throw new Error('Otp expired');
            } else if (err instanceof jwt.JsonWebTokenError) {
                console.error('JWT Error:', err.message);
                throw new Error('Invalid token');
            } else {
                console.error('Unknown error during OTP verification:', err);
                throw new Error('Otp invalid');
            }
        }
    }


    async resendOtp(email: string) {
        try {
            const employee = await  this.employeeRepository .findEmployeeByEmail(email);
            if (!employee) {
                throw new Error('Employee not found');
            }
            if (employee.is_verified) {
                throw new Error('Employee already verified');
            }
            const otp = this.generateOtp();
            await otpService.sendOtp(email, otp);
            const newOtpToken = jwt.sign({ email, otp }, JWT_SECRET, { expiresIn: OTP_EXPIRY_TIME });
            return { message: 'Otp sent to your email', newOtpToken };
        } catch (err) {
            throw new Error('Unknown error occured');
        }
    }

    async employeeLogin(email: string, password: string) {
        const employee = await  this.employeeRepository .findEmployeeByEmail(email);
        if (!employee) {
            throw new Error('Employee does not exists')
        }
        const isPasswordValid = await bcrypt.compare(password, employee.password)
        if (!isPasswordValid) {
            throw new Error('Invalid password')
        }
        if (!employee.is_verified) {
            throw new Error('Employee is not verified')
        }
        const token = jwt.sign({ email: employee.email, id: employee._id }, JWT_SECRET, { expiresIn: '10h' });
        return {
            token, employee: { email: employee.email, id: employee._id, employeeName: employee.name, is_done: employee.is_verified },
            message: 'Employee login successful'
        }
    }

    async getEmployeeDetails(employeeId: string) {
        const result = await  this.employeeRepository .findEmployeeById(employeeId);
        if (!result) {
            throw new Error('Timeslot not found');
        }
        return result;
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
        const timeSlots = await  this.employeeRepository .findTimeslotById(employeeId);
        if (!timeSlots) {
            throw new Error('Timeslot not found');
        }
        return timeSlots;
    }

    async deleteSlotsByEmployeeId(employeeId: string) {
        try {
            return await  this.employeeRepository .deleteMany(employeeId);
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

export const employeeService = new EmployeeService(employeeRepository);