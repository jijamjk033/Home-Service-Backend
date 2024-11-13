"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceService = void 0;
const serviceRepository_1 = require("../repositories/serviceRepository");
class ServicesServices {
    constructor(repository) {
        this.repository = repository;
    }
    addService(serviceName, price, description, categoryId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repository.addService(serviceName, price, description, categoryId, imageUrl);
            return result;
        });
    }
    getServiceById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = yield this.repository.findById(categoryId);
            if (!service) {
                throw new Error('Service not found');
            }
            return service;
        });
    }
    getServiceByServiceId(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = yield this.repository.findByServiceId(serviceId);
            if (!service) {
                throw new Error('Service not found');
            }
            return service;
        });
    }
    updateServiceById(serviceId, serviceName, price, description, categoryId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedService = yield this.repository.updateById(serviceId, {
                name: serviceName,
                price: price,
                description: description,
                category: categoryId,
                image: imageUrl,
            });
            return updatedService;
        });
    }
    deleteServiceById(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = yield this.repository.findById(serviceId);
            if (!service) {
                throw new Error('Service not found');
            }
            yield this.repository.delete(serviceId);
        });
    }
}
exports.serviceService = new ServicesServices(serviceRepository_1.serviceRepository);
