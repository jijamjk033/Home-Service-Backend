import { IEmployee } from "../models/employeeModel";
import { ITimeslot } from "../models/timeslotModel";

export interface IEmployeeRepository {
    createEmployee(employeeData: IEmployee): Promise<IEmployee>;
    findEmployeeByEmail(email: string): Promise<IEmployee | null>;  
    findEmployeeById(employeeId: string): Promise<IEmployee | null>;  
    updateEmployeeVerificationStatus(email: string, is_verified: boolean): Promise<void>;
    findSlot(employeeId: string, date: string, startTime: string, endTime: string): Promise<ITimeslot | null>; 
    newTimeslot(employeeId: string, date: string, startTime: string, endTime: string): Promise<ITimeslot>;
    findTimeslotById(employeeId: string): Promise<ITimeslot[]>;  
    deleteMany(employeeId: string): Promise<void>;
    deleteById(slotId: string): Promise<void>;
}

