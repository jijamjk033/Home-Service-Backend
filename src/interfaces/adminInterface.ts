import { IEmployee } from "../models/employeeModel";
import { IUser } from "../models/userModel";
import { Request, Response } from "express";

export interface IAdminController {
    adminLogin(req: Request, res: Response): Promise<void>;
    getUsers(req: Request, res: Response): Promise<void>;
    getEmployees(req: Request, res: Response): Promise<void>;
}

export interface IAdminService {
    adminLogin(email: string, password: string): Promise<{ token: string, admin: { email: string, id: string, username: string }, message: string }>;
    getUsers(): Promise<IUser[]>;
    getEmployees(): Promise<IEmployee[]>;
}

export interface IAdminRepository {
    findAdminByEmail(email: string): Promise<IUser | null>;
    getUsersData(): Promise<IUser[]>;
    getEmployeesData(): Promise<IEmployee[]>;
}