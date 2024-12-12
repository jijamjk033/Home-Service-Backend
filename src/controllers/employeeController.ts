import { createErrorResponse, createSuccessResponse } from "../helpers/responseHelper";
import { Request, Response } from 'express';
import { employeeService } from "../services/employeeService";
import { StatusCodes } from 'http-status-codes';
import { IEmployeeController } from "../interfaces/employeeInterface";

class EmployeeController implements IEmployeeController{

    async signup(req: any, res: any) {
        try {
            const result = await employeeService.signup(req.body);
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
            const result = await employeeService.verifyOtp(token, otp);
            return res.status(StatusCodes.OK).json(createSuccessResponse(result));
    
        } catch (err: any) {
            console.error('Error verifying OTP:', err.message);
            if (err.message === 'Otp invalid') {
                return res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('Invalid OTP. Please try again.'));
            } else if (err.message === 'Otp expired') {
                return res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('OTP has expired. Request a new one.'));
            } else if (err.message === 'Invalid token') {
                return res.status(StatusCodes.UNAUTHORIZED).json(createErrorResponse('Invalid or malformed token.'));
            } else {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorResponse('An unknown error occurred.'));
            }
        }
    }
    

    async resendOtp(req: Request, res: Response) {
        const { email } = req.body;
        if (!email) {
            return res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('Email must be provided'));
        }
        try {
            const result = await employeeService.resendOtp(email);
            return res.status(StatusCodes.OK).json(createSuccessResponse(result));
        } catch (err) {
            return res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('An unknown error occurred'));
        }
    }

    async employeeLogin(req: Request, res: Response) {

        const { email, password } = req.body;
        try {
            const result = await employeeService.employeeLogin(email, password);
            res.status(StatusCodes.OK).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse(err.message));
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getEmployeeDetails(req: Request, res: Response){
        const employeeId = req.params.id;
        try{
            const employeeDetails = await employeeService.getEmployeeDetails(employeeId);
            res.status(StatusCodes.OK).json(createSuccessResponse(employeeDetails));
        }catch(error){
            res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Error fetching Employee Data", error });
        }
    }
}

export const employeeController = new EmployeeController()