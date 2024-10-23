import { IEmployeeRepository } from "../interfaces/employeeInterface";
import Employee, { IEmployee } from "../models/employeeModel";
import { ITimeslot, timeslots } from "../models/timeslotModel";

class EmployeeRepository implements IEmployeeRepository {
    async createEmployee(employeeData: any) {
        const employee = new Employee(employeeData);
        const saved = await employee.save();
        return saved.toObject() as unknown as IEmployee;
    }

    async findEmployeeByEmail(email: string): Promise<any> {
        const employee = await Employee.findOne({ email: email }) as IEmployee | null;

        if (!employee) {
            return null;
        }
        return employee;
    }

    async findEmployeeById(employeeId: string) {
        const employee = await Employee.findOne({ _id: employeeId }) as IEmployee | null;

        if (!employee) {
            return null;
        }
        return employee;
    }

    async updateEmployeeVerificationStatus(email: string, is_verified: boolean) {
        const statusUpdate = is_verified ? 'active' : 'blocked';
        await Employee.updateOne({ email },
            { is_verified, status: statusUpdate });
    }

    async findSlot(employeeId: string, date: string, startTime: string, endTime: string): Promise<ITimeslot | null> {
        const existingSlot = await timeslots.findOne({
            employeeId,
            date,
            startTime,
            endTime
        }).lean();  

        return existingSlot as ITimeslot | null;
    }

    async newTimeslot(employeeId: string, date: string, startTime: string, endTime: string): Promise<ITimeslot> {
        const newTimeSlot = new timeslots({ employeeId, date, startTime, endTime });
        const result = await newTimeSlot.save();
        return result.toObject() as unknown as ITimeslot;
    }

    async findTimeslotById(employeeId: string): Promise<ITimeslot[]> {
        const timeslotList = await timeslots.find({ employeeId: employeeId }).lean();
        return timeslotList as unknown as ITimeslot[];
    }

    async deleteMany(employeeId: string) {
        await timeslots.deleteMany({ employeeId: employeeId });
    }
    async deleteById(slotId: string) {
        await timeslots.findByIdAndDelete(slotId);
    }
}

export const employeeRepository = new EmployeeRepository();