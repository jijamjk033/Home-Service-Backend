import { Request, Response } from 'express';
import { IAddress } from '../models/addressModel';

export interface IAddressController {
    addAddress(req: Request, res: Response): Promise<void>;
    getAddress(req: Request, res: Response): Promise<void>;
    fetchAddressSelected(req: Request, res: Response): Promise<void>;
}

export interface IAddressService {
    addAddress(
        address: string,
        locality: string,
        city: string,
        state: string,
        pincode: number,
        user: string,
        typeOfAddress: string
    ): Promise<IAddress>;

    getAddressByUser(userId: string): Promise<IAddress[]>;

    fetchAddressSelected(addressId: string): Promise<IAddress>;
}