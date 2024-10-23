import { Iservices } from "../models/serviceModel";

export interface IServiceRepository {
    addService(serviceName: string, price: number, description: string, categoryId: string, imageUrl: string): Promise<Iservices>;
    findById(categoryId: string): Promise<Iservices[]>;
    findByServiceId(serviceId: string): Promise<Iservices>;
    updateById(id: string, updateData: any): Promise<void>;
    delete(id: string): Promise<void>;
} 