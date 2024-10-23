import { IUserRepository } from "../interfaces/userInterfaces";
import { addressModel, IAddress } from "../models/addressModel";
import { IUser, User } from "../models/userModel";

export class UserRepository implements IUserRepository {

    async createUser(userData: IUser) {
        const user = new User(userData);
        const savedUser = await user.save();
        return savedUser.toObject() as unknown as IUser;
    }

    async findUserByEmail(email: string): Promise<any> {
        const user = await User.findOne({ email: email }) as IUser | null;

        if (!user) {
            return null;
        }
        return user;
    }

    async updateUserVerificationStatus(email: string, is_verified: boolean) {
        const statusUpdate = is_verified ? 'active' : 'inactive';

        await User.updateOne(
            { email },
            { is_verified, status: statusUpdate }
        );
    }

    async addAddress(address: string, locality: string, city: string, state: string, pincode: number, user: string, typeOfAddress: string) {
        const newAddress = new addressModel({
            address,
            locality,
            city,
            state,
            pincode,
            user,
            typeOfAddress
        });
        const savedAddress = await newAddress.save();
        return savedAddress.toObject() as unknown as IAddress;
    }
    
    async getAddressByUser(userId: string) {
        try {
            const addresses =   await addressModel.find({ user: userId }).lean(); 
            return addresses as unknown as IAddress[];
        } catch (error) {
            throw new Error('Error fetching addresses from the database');
        }
    }
}


