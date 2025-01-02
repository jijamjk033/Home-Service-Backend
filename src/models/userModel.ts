import mongoose from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    _id: string,
    name: string;
    email: string;
    password: string;
    phone: number;
    status: boolean;
    role: string;
    refreshToken: string;
    is_verified: boolean;
    isAdmin: boolean;
}


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: emailRegex,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "blocked"],
        },
        role: {
            type: String,
            enum: ['Admin', 'User'],
            default: 'User'
        },
        refreshToken: {
            type: String,
            default: null
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        is_verified: {
            type: Boolean,
            default: false,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model('User', userSchema);