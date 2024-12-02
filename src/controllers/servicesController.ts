import { Request, Response } from "express";
import { createSuccessResponse, createErrorResponse } from '../helpers/responseHelper';
import { StatusCodes } from 'http-status-codes';
import { CustomMulterRequest } from "../config/multer";
import imageUpload from "../helpers/imageUpload";
import { serviceService } from "../services/serviceService";
import { IServiceController } from "../interfaces/serviceInterface";

class ServiceController implements IServiceController {
    async addServices(req: CustomMulterRequest, res: Response) {
        try {
            const serviceName = req.body.serviceName;
            const price = req.body.price;
            const description = req.body.description;
            const categoryId = req.body.categoryId;
            let imageUrl = req.body.imageUrl;
            const image = req.files?.image?.[0];
            if (image) {
                imageUrl = await imageUpload.uploadImage(image.path);
            }
            if (!imageUrl) {
                throw new Error("Failed to upload image");
            }
            const result = await serviceService.addService(serviceName, price, description, categoryId, imageUrl);

            res.status(StatusCodes.OK).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse(err.message));
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async getServiceById(req: Request, res: Response) {
        try {
            const categoryId = req.params.id;
            const service = await serviceService.getServiceById(categoryId);
            res.status(StatusCodes.OK).json({
                success: true,
                data: service,
                message: 'Service fetched successfully'
            });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: 'Error fetching services', error });
        }
    }
    async getServiceByServiceId(req: Request, res: Response) {

        const serviceId = req.params.id;
        try {
            const service = await serviceService.getServiceByServiceId(serviceId);
            res.status(StatusCodes.OK).json({
                success: true,
                data: service,
                message: 'Service fetched successfully'
            });
        } catch (error) {
            if (error instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json({ message: 'Error fetching services', error });
            }
        }
    }

    async updateService(req: CustomMulterRequest, res: Response) {
        try {
            const serviceId = req.params.id;
            const serviceName = req.body.serviceName;
            const price = req.body.price;
            const description = req.body.description;
            const categoryId = req.body.categoryId;
            let imageUrl = req.body.imageUrl;
            const image = req.files?.image?.[0];
            if (image) {
                imageUrl = await imageUpload.uploadImage(image.path);
            }
            if (!imageUrl) {
                throw new Error("Failed to upload image");
            }
            const result = await serviceService.updateServiceById(serviceId, serviceName, price, description, categoryId, imageUrl);

            res.status(StatusCodes.OK).json(createSuccessResponse(result));
        } catch (err) {
            if (err instanceof Error) {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse(err.message));
            } else {
                res.status(StatusCodes.BAD_REQUEST).json(createErrorResponse('An unknown error occurred'));
            }
        }
    }

    async deleteService(req: Request, res: Response) {
        try {
            const serviceId = req.params.id;
            await serviceService.deleteServiceById(serviceId);
            res.status(StatusCodes.OK).json({ message: 'Service deleted successfully' });
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: 'Error deleting service', error });
        }
    }
}


export const serviceController = new ServiceController();
