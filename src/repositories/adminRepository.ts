import { IAdminRepository } from "../interfaces/adminInterface";
import Employee, { IEmployee } from "../models/employeeModel";
import { IUser, User } from "../models/userModel";

class AdminRepository implements IAdminRepository {
    
    async findAdminByEmail(email:string){
        const user = await User.findOne({ email:email }).lean();
        return user as IUser | null;
    }

    async getUsersData() {
        const user = await User.find({});
        return user as unknown as IUser[];

    }
    async getEmployeesData() {
        const employee = await Employee.find({});
        return employee as unknown as IEmployee[];
    }

}

export const adminRepository = new AdminRepository();