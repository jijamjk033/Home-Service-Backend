import { adminRepository } from "../repositories/adminRepository";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAdminRepository } from "../interfaces/adminInterface";


const JWT_SECRET = process.env.JWT_SECRET || 'myjwtsecret';

class AdminService {

    private adminRepository:IAdminRepository;
    constructor(adminRepository:IAdminRepository){
        this.adminRepository = adminRepository;
    }

    async adminLogin(email: string, password: string) {
        const admin = await this.adminRepository.findAdminByEmail(email)

        if (!admin) {
            throw new Error('Admin not exists')
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password)

        if (!isPasswordValid) {
            throw new Error('Invalid password')
        }

        if (!admin.isAdmin) {
            throw new Error('Not an Admin')
        }

        const token = jwt.sign({ email: admin.email, id: admin._id }, JWT_SECRET, { expiresIn: '10h' });
        return { token, admin: { email: admin.email, id: admin._id, username: admin.name }, message: 'Admin login successfull' }
    }

    async getUsers() {
        const data = await this.adminRepository.getUsersData();

        return data;
    }

    async getEmployees() {
        const data = await this.adminRepository.getEmployeesData();
        return data;
    }

}

export const adminService = new AdminService(adminRepository)