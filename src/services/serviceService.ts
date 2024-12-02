import { IServiceRepository, IServiceService } from "../interfaces/serviceInterface";
import { serviceRepository } from "../repositories/serviceRepository";


class ServicesServices implements IServiceService{

    private repository: IServiceRepository;

    constructor(repository: IServiceRepository) {
        this.repository = repository;
    }
    
    async addService(serviceName: string, price: number, description: string, categoryId: string, imageUrl: string) {
        const result = await this.repository.addService(serviceName, price, description, categoryId, imageUrl);
        return result;
    }

    async getServiceById(categoryId: string) {
        const service = await this.repository.findById(categoryId);
        if (!service) {
            throw new Error('Service not found');
        }
        return service;
    }

    async getServiceByServiceId(serviceId:string){
        const service = await this.repository.findByServiceId(serviceId);
        if (!service) {
            throw new Error('Service not found');
        }
        return service;
    }

    async updateServiceById(serviceId: string, serviceName: string, price: number, description: string, categoryId: string, imageUrl: string) {
        const updatedService = await this.repository.updateById(serviceId, {
            name: serviceName,
            price: price,
            description: description,
            category: categoryId,
            image: imageUrl,
        });
    
        return updatedService;
    }

    async deleteServiceById(serviceId: string) {
        const service = await this.repository.findById(serviceId);

        if (!service) {
            throw new Error('Service not found');
        }

        await this.repository.delete(serviceId);
    }
}


export const serviceService = new ServicesServices(serviceRepository);