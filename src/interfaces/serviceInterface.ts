import { Iservices } from "../models/serviceModel";
import { Request, Response } from "express";
import { CustomMulterRequest } from "../config/multer";

export interface IServiceController {
    addServices(req: CustomMulterRequest, res: Response): Promise<void>;
    getServiceById(req: Request, res: Response): Promise<void>;
    getServiceByServiceId(req: Request, res: Response): Promise<void>;
    updateService(req: CustomMulterRequest, res: Response): Promise<void>;
    deleteService(req: Request, res: Response): Promise<void>;
}

export interface IServiceService {
    addService( serviceName: string, price: number, description: string, categoryId: string, imageUrl: string): Promise<Iservices>;
    getServiceById(categoryId: string): Promise<Iservices[]>;
    getServiceByServiceId(serviceId: string): Promise<Iservices>;
    updateServiceById( serviceId: string, serviceName: string, price: number, description: string, categoryId: string, imageUrl: string): Promise<void>;
    deleteServiceById(serviceId: string): Promise<void>;
}

export interface IServiceRepository {
    addService(serviceName: string, price: number, description: string, categoryId: string, imageUrl: string): Promise<Iservices>;
    findById(categoryId: string): Promise<Iservices[]>;
    findByServiceId(serviceId: string): Promise<Iservices>;
    updateById(id: string, updateData: any): Promise<void>;
    delete(id: string): Promise<void>;
} 