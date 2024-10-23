"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    address: {
        type: String,
        required: true
    },
    locality: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true
    },
    typeOfAddress: {
        type: String,
        enum: ['home', 'office'],
        required: true
    }
}, {
    timestamps: true,
});
exports.addressModel = mongoose_1.default.model('address', categorySchema);
