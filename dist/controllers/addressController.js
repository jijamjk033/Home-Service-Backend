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
exports.addressController = void 0;
const http_status_codes_1 = require("http-status-codes");
const userRepository_1 = require("../repositories/userRepository");
const addressService_1 = require("../services/addressService");
const userRepository = new userRepository_1.UserRepository();
const addressService = new addressService_1.AddressService(userRepository);
class AddressController {
    addAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { address, locality, city, state, pincode, user, typeOfAddress } = req.body;
            try {
                const result = yield addressService.addAddress(address, locality, city, state, pincode, user, typeOfAddress);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: 'Address saved successfully',
                    data: result,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error saving address:', error);
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Failed to save address. Please try again later.',
                        error: error.message || 'Internal Server Error',
                    });
                }
            }
        });
    }
    getAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            try {
                const addresses = yield addressService.getAddressByUser(userId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: 'Addresses fetched successfully',
                    data: addresses,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error fetching addresses:', error);
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Failed to fetch addresses. Please try again later.',
                        error: error.message || 'Internal Server Error',
                    });
                }
            }
        });
    }
    fetchAddressSelected(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const addressId = req.params.id;
            try {
                const addresses = yield addressService.fetchAddressSelected(addressId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    message: 'Address fetched successfully',
                    data: addresses,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error fetching address:', error);
                    res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Failed to fetch address. Please try again later.',
                        error: error.message || 'Internal Server Error',
                    });
                }
            }
        });
    }
}
exports.addressController = new AddressController();
