import { IUser } from "../models/userModel";
import { IAddress } from "../models/addressModel";

export interface IUserRepository {
    createUser(userData: IUser): Promise<IUser>;
    findUserByEmail(email: string): Promise<IUser>;
    updateUserVerificationStatus(email: string, is_verified: boolean): Promise<void>;
    addAddress(address: string, locality: string, city: string, state: string, pincode: number, user: string, typeOfAddress: string): Promise<IAddress>;
    getAddressByUser(userId:string):Promise<IAddress[]>;
}
