import mongoose from "mongoose";

const transaction = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['debit', 'credit'],
        required: true
    }
})

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      transaction:[transaction],

      walletBalance: {
        type: Number,
        default: 0,
      },
})

export const Wallet = mongoose.model('Wallet', walletSchema);