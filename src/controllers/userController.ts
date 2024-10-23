import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { createSuccessResponse, createErrorResponse } from '../helpers/responseHelper';
import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../repositories/userRepository';

const userRepository = new UserRepository(); 
const userService = new UserService(userRepository);

class UserController {

    async signup(req: any, res: any) {
        try {
            const result = await userService.signup(req.body);
            res.status(StatusCodes.OK).json(createSuccessResponse(result));
        } catch (err) {
            console.error("Signup error:", err);
            if (err instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse(err.message));
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async verifyOtp(req: Request, res: Response) {

        const { otp, token } = req.body;

        try {
            if (!token) {
                throw new Error('JWT token must be provided');
            }
            const result = await userService.verifyOtp(token, otp);

            res.status(StatusCodes.OK).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse(err.message));
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async resendOtp(req: Request, res: Response) {
        const { email } = req.body;

        if (!email) {
            res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('Email must be provided'));
        }

        try {
            const result = await userService.resendOtp(email);
            res.status(StatusCodes.OK).json(createSuccessResponse(result));
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('An unknown error occurred'));
        }
    }

    async userLogin(req: Request, res: Response) {

        const { email, password } = req.body;

        try {
            const result = await userService.userLogin(email, password);
            res.status(StatusCodes.OK).json(createSuccessResponse(result));

        } catch (err) {
            if (err instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse(err.message));
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }


    async addAddress(req: Request, res: Response) {
        const { address, locality, city, state, pincode, user, typeOfAddress } = req.body;

        try {
            const result = await userService.addAddress(address, locality, city, state, pincode, user, typeOfAddress);
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
            const addresses = await userService.getAddressByUser(userId);
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
}





export const userController = new UserController();