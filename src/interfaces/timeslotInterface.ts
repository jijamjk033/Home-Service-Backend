import { Request, Response } from 'express';
import { ITimeslot } from '../models/timeslotModel';

export interface ITimeslotController {
    getTimeslotByid(req: Request, res: Response): Promise<void>;
    fetchTimeSlots(req: Request, res: Response): Promise<void>;
    timeslotCreation(req: Request, res: Response): Promise<void>;
    getTimeslots(req: Request, res: Response): Promise<void>;
    deleteTimeslots(req: Request, res: Response): Promise<Response>;
    deleteTimeslotsById(req: Request, res: Response): Promise<Response>;
}

export interface ITimeslotService {
    fetchTimeSlots(employeeId: string, date: string): Promise<ITimeslot[]>;
    getTimeslotByid(slotId: string): Promise<ITimeslot>;
    timeslot(employeeId: string, startDate: string, endDate: string, startTime: string, endTime: string): Promise<{ message: string; slots: string[] }>;
    getTimeSlots(employeeId: string): Promise<ITimeslot[]>;
    deleteSlotsByEmployeeId(employeeId: string): Promise<void>;
    deleteSlotsBySlotId(slotId: string): Promise<void>;
}

