import { Request, Response } from "express";
import { createSuccessResponse, createErrorResponse } from '../helpers/responseHelper';
import { adminService } from "../services/adminService";
import { StatusCodes } from 'http-status-codes';
import { IAdminController } from "../interfaces/adminInterface";

class AdminController implements IAdminController{
    async adminLogin(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const result = await adminService.adminLogin(email, password);
            res.status(StatusCodes.OK).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse(err.message));
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }


    async getUsers(req: Request, res: Response) {
        try {

            const users = await adminService.getUsers();

            res.status(StatusCodes.OK).json(createSuccessResponse(users));
        } catch (err) {
            if (err instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse(err.message));
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getEmployees(req: Request, res: Response) {
        try {

            const employees = await adminService.getEmployees();

            res.status(StatusCodes.OK).json(createSuccessResponse(employees));
        } catch (err) {
            if (err instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse(err.message));
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    
}

export const adminController = new AdminController();