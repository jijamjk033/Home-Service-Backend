import { IServiceRepository } from "../interfaces/serviceInterface";
import { Iservices, Service } from "../models/serviceModel";

class ServiceRepository implements IServiceRepository{

    async addService(serviceName: string, price: number, description: string, categoryId: string, imageUrl: string) {
        const service = new Service({
            name: serviceName,
            image: imageUrl,
            category: categoryId,
            price: price,
            description: description,
        })
        const saved = await service.save();
        return saved.toObject() as unknown as Iservices;
    }
    async findById(categoryId: string) {
        const service =  await Service.find({ category: categoryId });
        return service as unknown as Iservices[];
    }
    async findByServiceId(serviceId: string){
        const service = await Service.findOne({ _id: serviceId });
        if (!service) {
            throw new Error('Service not found');
        }
        return service as unknown as Iservices;
    }

    async updateById(id: string, updateData: { name: string; price: number; description: string; category: string; image: string }) {
        await Service.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id: string) { 
        await Service.findByIdAndDelete(id);
    }
}

export const serviceRepository = new ServiceRepository();