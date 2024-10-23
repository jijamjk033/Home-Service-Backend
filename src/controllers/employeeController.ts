import { createErrorResponse, createSuccessResponse } from "../helpers/responseHelper";
import { Request, response, Response } from 'express';
import { employeeService } from "../services/employeeService";
import { StatusCodes } from 'http-status-codes';

class EmployeeController {

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
            res.status(StatusCodes.OK).json(createSuccessResponse(result));
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('An unknown error occurred'));
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

    async timeslotCreation(req: Request, res: Response) {
        const { employeeId, startDate, endDate, startTime, endTime } = req.body;
        try {
            const result = await employeeService.timeslot(employeeId, startDate, endDate, startTime, endTime);
            res.status(StatusCodes.OK).json(createSuccessResponse(result));
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error in timeslot creation:', error.message);
                if (error.message === 'Time slot already exists for this date and time.') {
                    res.status(StatusCodes.CONFLICT).json(createErrorResponse(error.message));
                } else {
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorResponse(error.message));
                }
            } else {
                console.error('Unknown error in timeslot creation');
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }
    async getTimeslots(req: Request, res: Response) {
        const employeeId = req.params.id;
        try {
            const timeSlots = await employeeService.getTimeSlots(employeeId);
            res.status(StatusCodes.OK).json({
                success: true,
                data: timeSlots,
                message: "Timeslot fetched successfully"
            });
        }
        catch (error) {
            res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Error fetching Timeslots", error });
        }

    }

    async deleteTimeslots(req: Request, res: Response) {
        const employeeId = req.params.id;

        try {
            const result = await employeeService.deleteSlotsByEmployeeId(employeeId);
            return res.status(StatusCodes.OK).json({ data:result, message: 'Time slots deleted successfully for employee.' });
        } catch (error) {
            console.error('Error deleting time slots:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while deleting the time slots.' });
        }
    }
    async deleteTimeslotsById(req: Request, res: Response){
        const slotId = req.params.id;
        try {
            const result = await employeeService.deleteSlotsBySlotId(slotId);
            return res.status(StatusCodes.OK).json({ data:result, message: 'Time slot deleted successfully.' });
        } catch (error) {
            console.error('Error deleting time slots:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while deleting the time slots.' });
        }
    }
}

export const employeeController = new EmployeeController()