import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserRepository } from "../repositories/userRepository";
import { AddressService } from '../services/addressService';
import { IAddressController } from '../interfaces/addressInterface';

const userRepository = new UserRepository();
const addressService = new AddressService(userRepository);

class AddressController implements IAddressController{
    async addAddress(req: Request, res: Response) {
        const { address, locality, city, state, pincode, user, typeOfAddress } = req.body;
        try {
            const result = await addressService.addAddress(address, locality, city, state, pincode, user, typeOfAddress);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Address saved successfully',
                data: result,
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error saving address:', error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Failed to save address. Please try again later.',
                    error: error.message || 'Internal Server Error',
                });
            }

        }
    }

    async getAddress(req: Request, res: Response) {
        const userId = req.params.id;
        try {
            const addresses = await addressService.getAddressByUser(userId);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Addresses fetched successfully',
                data: addresses,
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching addresses:', error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Failed to fetch addresses. Please try again later.',
                    error: error.message || 'Internal Server Error',
                });
            }
        }
    }

    async fetchAddressSelected(req: Request, res: Response) {
        const addressId = req.params.id;
        try {
            const addresses = await addressService.fetchAddressSelected(addressId);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Address fetched successfully',
                data: addresses,
            });
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching address:', error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Failed to fetch address. Please try again later.',
                    error: error.message || 'Internal Server Error',
                });
            }
        }
    }
}

export const addressController = new AddressController();