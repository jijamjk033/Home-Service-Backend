import mongoose from "mongoose";


export interface IEmployee extends Document {
  _id:string,
  name: string;
  email: string;
  password: string;
  phone: number;
  role: string;
  yearsOfExperience: number;
  status: string;
  is_verified: boolean;
}

const employeeSchema = new mongoose.Schema(
  {
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
      type: Number,
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
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;