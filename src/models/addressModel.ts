import mongoose from "mongoose";


export interface IAddress{
    address:string,
    locality:string,
    city:string,
    state:string,
    pincode:number,
    user:string,
    typeOfAddress: 'home' | 'office';
}

const categorySchema = new mongoose.Schema(
    {
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
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        typeOfAddress: {
            type: String,
            enum: ['home', 'office'],
            required: true
        }
    },
    {
        timestamps: true,
    }
);

export const addressModel = mongoose.model('address',categorySchema);