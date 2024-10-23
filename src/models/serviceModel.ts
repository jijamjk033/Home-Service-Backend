import mongoose from "mongoose";

export interface Iservices {
    name:string,
    image:string,
    price:number,
    description:string,
    category:string,

}
const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        image: {
            type: String,
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
    },
    {
        timestamps: true,
    }
)

export const Service = mongoose.model('Service', serviceSchema);