import { IEmployee } from "../models/employeeModel";
import { ITimeslot } from "../models/timeslotModel";
import { Request, Response } from 'express';

export interface IEmployeeController {
  signup(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<Response>;
  resendOtp(req: Request, res: Response): Promise<Response>;
  employeeLogin(req: Request, res: Response): Promise<void>;
  getEmployeeDetails(req: Request, res: Response): Promise<void>;
}

export interface IEmployeeService {
    signup(employeeData: any): Promise<{ message: string; otpToken: string } | { status: number; message: string }>;
    generateOtp(): string;
    verifyOtp(otpToken: string, otp: string): Promise<{ message: string }>;
    resendOtp(email: string): Promise<{ message: string; newOtpToken: string }>;
    employeeLogin(email: string, password: string): Promise<{
      token: string;
      employee: {
        email: string;
        id: string;
        employeeName: string;
        is_done: boolean;
      };
      message: string;
    }>;
    getEmployeeDetails(employeeId: string): Promise<IEmployee | Document>;
  }

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

