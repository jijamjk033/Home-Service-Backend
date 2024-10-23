"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const employeeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    rate: {
        type: String,
    },
    rating: {
        type: String,
    },
    yearsOfExperience: {
        type: Number,
        required: true,
    },
    is_verified: {
        type: Boolean,
    },
    status: {
        type: String,
        enum: ["active", "blocked"],
    },
}, { timestamps: true });
const Employee = mongoose_1.default.model("Employee", employeeSchema);
exports.default = Employee;
