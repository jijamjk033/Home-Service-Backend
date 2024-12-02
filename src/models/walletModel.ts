import mongoose from "mongoose";

export interface ITransaction {
    date?: Date; 
    amount: number;
    type: 'debit' | 'credit';
}

export interface WalletModel extends Document {
    user: string;
    transactions: ITransaction[]; 
    walletBalance?: number;
}

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
      transactions:[transaction],

      walletBalance: {
        type: Number,
        default: 0,
      },
})

export const Wallet = mongoose.model('Wallet', walletSchema);