import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { createSuccessResponse, createErrorResponse } from '../helpers/responseHelper';
import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../repositories/userRepository';
import { IUserController } from '../interfaces/userInterfaces';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

class UserController implements IUserController {

    async signup(req: any, res: any) {
        try {
            const result = await userService.signup(req.body);
            console.log('Signup result:', result);
            res.status(StatusCodes.OK).json(createSuccessResponse({ otpToken: result.otpToken, message: 'Otp sent to your email' }));
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

    async getUserDetails(req: Request, res: Response) {
        try {
            const userid = req.params.id;
            const userDetails = await userService.getUserDetails(userid);
            res.status(StatusCodes.OK).json(createSuccessResponse(userDetails));
        } catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse(error.message));
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getUserTransactions(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const transactions = await userService.getUserTransactions(userId);
            res.status(StatusCodes.OK).json(createSuccessResponse(transactions));
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching transactions', error);
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorResponse(error.message))
            }
        }
    }
}



export const userController = new UserController();