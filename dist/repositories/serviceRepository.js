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
exports.serviceRepository = void 0;
const serviceModel_1 = require("../models/serviceModel");
class ServiceRepository {
    addService(serviceName, price, description, categoryId, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new serviceModel_1.Service({
                name: serviceName,
                image: imageUrl,
                category: categoryId,
                price: price,
                description: description,
            });
            return yield service.save();
        });
    }
    findById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield serviceModel_1.Service.find({ category: categoryId });
        });
    }
    findByServiceId(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield serviceModel_1.Service.find({ _id: serviceId });
        });
    }
    updateById(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return serviceModel_1.Service.findByIdAndUpdate(id, updateData, { new: true });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield serviceModel_1.Service.findByIdAndDelete(id);
        });
    }
}
exports.serviceRepository = new ServiceRepository();
