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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceController = void 0;
const responseHelper_1 = require("../helpers/responseHelper");
const http_status_codes_1 = require("http-status-codes");
const imageUpload_1 = __importDefault(require("../helpers/imageUpload"));
const serviceService_1 = require("../services/serviceService");
class ServiceController {
    addServices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const serviceName = req.body.serviceName;
                const price = req.body.price;
                const description = req.body.description;
                const categoryId = req.body.categoryId;
                let imageUrl = req.body.imageUrl;
                const image = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b[0];
                if (image) {
                    imageUrl = yield imageUpload_1.default.uploadImage(image.path);
                }
                if (!imageUrl) {
                    throw new Error("Failed to upload image");
                }
                const result = yield serviceService_1.serviceService.addService(serviceName, price, description, categoryId, imageUrl);
                res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(result));
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)(err.message));
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)('An unknown error occurred'));
                }
            }
        });
    }
    getServiceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.id;
                const service = yield serviceService_1.serviceService.getServiceById(categoryId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    data: service,
                    message: 'Service fetched successfully'
                });
            }
            catch (error) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Error fetching services', error });
            }
        });
    }
    getServiceByServiceId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const serviceId = req.params.id;
            try {
                const service = yield serviceService_1.serviceService.getServiceByServiceId(serviceId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    data: service,
                    message: 'Service fetched successfully'
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Error fetching services', error });
                }
            }
        });
    }
    updateService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const serviceId = req.params.id;
                const serviceName = req.body.serviceName;
                const price = req.body.price;
                const description = req.body.description;
                const categoryId = req.body.categoryId;
                let imageUrl = req.body.imageUrl;
                const image = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b[0];
                if (image) {
                    imageUrl = yield imageUpload_1.default.uploadImage(image.path);
                }
                if (!imageUrl) {
                    throw new Error("Failed to upload image");
                }
                const result = yield serviceService_1.serviceService.updateServiceById(serviceId, serviceName, price, description, categoryId, imageUrl);
                res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(result));
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)(err.message));
                }
                else {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseHelper_1.createErrorResponse)('An unknown error occurred'));
                }
            }
        });
    }
    deleteService(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceId = req.params.id;
                yield serviceService_1.serviceService.deleteServiceById(serviceId);
                res.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Service deleted successfully' });
            }
            catch (error) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Error deleting service', error });
            }
        });
    }
}
exports.serviceController = new ServiceController();
