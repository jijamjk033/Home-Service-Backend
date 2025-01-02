import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { notificationService } from "../services/notificationService";

class NotificationController {
    async fetchNotifications(req: Request, res: Response){
        try {
            const id = req.params.id;
            const notifications = await notificationService.fetchNotifications(id);
            res.status(StatusCodes.OK).json({
                status: 'Success',
                data: notifications,
                message: ' Notifications fetched successfully'
            })
        } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Error fetching Messages', err,
            })
        }
    }
}

export const notificationController = new NotificationController()