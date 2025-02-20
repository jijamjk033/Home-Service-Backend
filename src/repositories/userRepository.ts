import { IUserRepository } from "../interfaces/userInterfaces";
import { addressModel, IAddress } from "../models/addressModel";
import { Booking } from "../models/bookingModel";
import { ITimeslot, timeslots } from "../models/timeslotModel";
import { IUser, User } from "../models/userModel";
import { ITransaction, Wallet } from "../models/walletModel";

export class UserRepository implements IUserRepository {

    async createUser(userData: IUser) {
        try {
            const user = new User(userData);
            const savedUser = await user.save();
            console.log('Saved user:', savedUser);
            return savedUser.toObject() as unknown as IUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }

    }

    async updateUser(userId: string, updateData: Partial<IUser>) {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );
        if (!updatedUser) {
            throw new Error(`User with ID ${userId} not found`);
        }
        return updatedUser.toObject() as unknown as IUser;
    }


    async createWallet(userId: string) {
        const wallet = new Wallet({
            user: userId,
            walletBalance: 0,
            transactions: []
        });

        await wallet.save();
    }

    async getUserTransactions(userId: string) {
        try {
            const transactions = Wallet.findOne({ user: userId }).lean();
            return transactions as unknown as ITransaction;
        } catch (error) {
            throw new Error('Error fetching transactions')
        }
    }

    async addTransactionToWallet(userId: string, amount: number, type: 'credit' | 'debit') {
        try {
            let wallet = await Wallet.findOne({ user: userId });

            if (!wallet) {
                wallet = new Wallet({
                    user: userId,
                    transaction: [],
                    walletBalance: 0,
                });
            }
            wallet.transactions.push({
                amount,
                type,
                date: new Date(),
            });

            if (type === 'credit') {
                wallet.walletBalance += amount;
            } else if (type === 'debit') {
                wallet.walletBalance -= amount;
            }
            await wallet.save();
            return wallet;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error updating wallet: ${error.message}`);
            }
        }
    }

    async findUserByEmail(email: string): Promise<any> {
        const user = await User.findOne({ email: email }) as IUser | null;

        if (!user) {
            return null;
        }
        return user;
    }

    async findUserById(userId: string): Promise<any> {
        const user = await User.findOne({ _id: userId }) as IUser | null;

        if (!user) {
            return null;
        }
        return user;
    }

    async updateUserVerificationStatus(email: string, is_verified: boolean) {
        const statusUpdate = is_verified ? 'active' : 'inactive';
        await User.updateOne(
            { email },
            { is_verified, status: statusUpdate }
        );
    }

    async addAddress(address: string, locality: string, city: string, state: string, pincode: number, user: string, typeOfAddress: string) {
        const newAddress = new addressModel({
            address,
            locality,
            city,
            state,
            pincode,
            user,
            typeOfAddress
        });
        const savedAddress = await newAddress.save();
        return savedAddress.toObject() as unknown as IAddress;
    }

    async getAddressByUser(userId: string) {
        try {
            const addresses = await addressModel.find({ user: userId }).lean();
            return addresses as unknown as IAddress[];
        } catch (error) {
            throw new Error('Error fetching addresses from the database');
        }
    }

    async fetchAddressSelected(addresId: string) {
        try {
            const address = await addressModel.find({ _id: addresId }).lean();
            return address as unknown as IAddress;
        } catch (error) {
            throw new Error('Error fetching addresses from the database');
        }
    }


    async fetchTimeSlots(employeeId: string, date: string) {
        try {
            const timeslotsFetched = await timeslots.find(
                { employeeId: employeeId, date: date, isBooked: false },
                { employeeId: 1, date: 1, startTime: 1, endTime: 1, isBooked: 1 }
            ).lean();
            return timeslotsFetched as unknown as ITimeslot[];

        } catch (error) {
            throw new Error('Error fetching timeslots from the database');
        }
    }

    async getTimeslot(slotId: string) {
        try {
            const timeslot = await timeslots.findOne({ _id: slotId }).lean();
            return timeslot as unknown as ITimeslot;
        } catch (error) {
            throw new Error('Error fetching timeslot from the database');
        }
    }

    async createBooking(userId: string, serviceId: string, addressId: string, timeslotId: string, paymentMethod: string, totalAmount: number, paymentResponse: object, bookingStatus: 'Pending' | 'Confirmed' | 'Cancelled', paymentStatus: 'Pending' | 'Success' | 'Failed') {
        try {
            const newBooking = new Booking({
                userId,
                serviceId,
                addressId,
                timeslotId,
                paymentMethod,
                totalAmount,
                paymentResponse,
                bookingStatus,
                paymentStatus
            });
            const savedBooking = await newBooking.save();
            return { success: true, message: 'Booking created successfully', booking: savedBooking };
        } catch (error) {
            console.error("Booking creation failed:", error);
            return { success: false, message: `Booking creation failed: ${error instanceof Error ? error.message : "Unknown error"}` };
        }
    }

    async updateTimeslot(slotId: string, booking: boolean) {
        try {
            const slot = await timeslots.findById(slotId);
            if (slot && slot.isBooked) {
                throw new Error('Slot is already booked');
            }
            const updateResult = await timeslots.updateOne({ _id: slotId }, { isBooked: booking });
            if (updateResult.modifiedCount === 0) {
                throw new Error('Failed to update slot booking status');
            }
            return { success: true, message: 'Slot updated successfully' };
        } catch (error) {
            console.error('Updation failed:', error);
            throw new Error(error instanceof Error ? error.message : 'Slot updation failed');
        }
    }

    async changeTimeslotStatus(slotId: string, booking: boolean) {
        try {
            const updateResult = await timeslots.updateOne({ _id: slotId }, { isBooked: booking });
            if (updateResult.modifiedCount === 0) {
                throw new Error('Failed to update slot booking status');
            }
            return { success: true, message: 'Slot updated successfully' };
        } catch (error) {
            console.error('Updation failed:', error);
            throw new Error(error instanceof Error ? error.message : 'Slot updation failed');
        }
    }

}


