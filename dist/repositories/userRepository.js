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
exports.UserRepository = void 0;
const addressModel_1 = require("../models/addressModel");
const userModel_1 = require("../models/userModel");
class UserRepository {
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new userModel_1.User(userData);
            return yield user.save();
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.User.findOne({ email: email });
            if (!user) {
                return null;
            }
            return user;
        });
    }
    updateUserVerificationStatus(email, is_verified) {
        return __awaiter(this, void 0, void 0, function* () {
            const statusUpdate = is_verified ? 'active' : 'inactive';
            return yield userModel_1.User.updateOne({ email }, { is_verified, status: statusUpdate });
        });
    }
    addAddress(address, locality, city, state, pincode, user, typeOfAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAddress = new addressModel_1.addressModel({
                address,
                locality,
                city,
                state,
                pincode,
                user,
                typeOfAddress
            });
            return yield newAddress.save();
        });
    }
    getAddressByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield addressModel_1.addressModel.find({ user: userId });
            }
            catch (error) {
                throw new Error('Error fetching addresses from the database');
            }
        });
    }
}
exports.UserRepository = UserRepository;
