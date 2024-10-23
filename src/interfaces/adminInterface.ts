import { IEmployee } from "../models/employeeModel";
import { IUser } from "../models/userModel";

export interface IAdminRepository {
    findAdminByEmail(email: string): Promise<IUser | null>;
    getUsersData(): Promise<IUser[]>;
    getEmployeesData(): Promise<IEmployee[]>;
}