import mongoose from "mongoose";

export interface ICategory{
    name:string,
    image:string
}

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Category = mongoose.model('Category', categorySchema);