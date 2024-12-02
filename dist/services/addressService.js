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
exports.AddressService = void 0;
class AddressService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    addAddress(address, locality, city, state, pincode, user, typeOfAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.addAddress(address, locality, city, state, pincode, user, typeOfAddress);
                return result;
            }
            catch (error) {
                console.error('Error in service layer:', error);
                throw new Error('Could not save address.');
            }
        });
    }
    getAddressByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.getAddressByUser(userId);
            }
            catch (error) {
                console.error('Address not fetched');
                throw new Error('Address not found');
            }
        });
    }
    fetchAddressSelected(addresId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.fetchAddressSelected(addresId);
            }
            catch (error) {
                console.error('Address not fetched');
                throw new Error('Address not found');
            }
        });
    }
}
exports.AddressService = AddressService;
