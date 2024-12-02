import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TimeslotService } from '../services/timeslotService';
import { UserRepository } from '../repositories/userRepository';
import { createErrorResponse, createSuccessResponse } from "../helpers/responseHelper";
import { employeeRepository } from '../repositories/employeeRepository';
import { ITimeslotController } from '../interfaces/timeslotInterface';

const userRepository = new UserRepository();
const timeslotService = new TimeslotService(userRepository,employeeRepository);

class TimeslotController implements ITimeslotController {
    
    async getTimeslotByid(req: Request, res: Response) {
        try {
            const timeslot = req.params.id;
            const timeslotDetails = await timeslotService.getTimeslotByid(timeslot);
            res.status(StatusCodes.OK).json({
                message: 'Timeslot fetched successfully',
                success: true,
                data: timeslotDetails
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: error.message,
                    success: false
                });
            }
        }
    }

    async fetchTimeSlots(req: Request, res: Response) {
        try {
            const employeeId = req.params.id;
            const date = req.query.date;
            if (typeof date === 'string') {
                const timeslots = await timeslotService.fetchTimeSlots(employeeId, date);
                res.status(StatusCodes.OK).json({
                    message: 'Timeslot fetched successfully',
                    success: true,
                    data: timeslots,
                });
            } else {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: 'Invalid date format',
                    success: false
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: error.message,
                    success: false
                });
            }
        }
    }

    async timeslotCreation(req: Request, res: Response) {
        const { employeeId, startDate, endDate, startTime, endTime } = req.body;
        try {
            const result = await timeslotService.timeslot(employeeId, startDate, endDate, startTime, endTime);
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
            const timeSlots = await timeslotService.getTimeSlots(employeeId);
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
            const result = await timeslotService.deleteSlotsByEmployeeId(employeeId);
            return res.status(StatusCodes.OK).json({ data:result, message: 'Time slots deleted successfully for employee.' });
        } catch (error) {
            console.error('Error deleting time slots:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while deleting the time slots.' });
        }
    }
    
    async deleteTimeslotsById(req: Request, res: Response){
        const slotId = req.params.id;
        try {
            const result = await timeslotService.deleteSlotsBySlotId(slotId);
            return res.status(StatusCodes.OK).json({ data:result, message: 'Time slot deleted successfully.' });
        } catch (error) {
            console.error('Error deleting time slots:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'An error occurred while deleting the time slots.' });
        }
    }
}

export const timeslotController = new TimeslotController();