import mongoose from "mongoose";

export interface ITimeslot {
    employeeId: string, 
    date: string;
    startTime: string;
    endTime: string;
    isBooked?: boolean; 
}

const timeslotSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    isBooked: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true,
})

export const timeslots = mongoose.model('Timeslots', timeslotSchema)