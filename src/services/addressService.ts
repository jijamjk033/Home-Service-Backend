import { IAddressService } from "../interfaces/addressInterface";
import { IUserRepository } from "../interfaces/userInterfaces";


export class AddressService implements IAddressService {

    private userRepository: IUserRepository;
    constructor(userRepository: IUserRepository){
        this.userRepository = userRepository
    }
    
    async addAddress(address: string, locality: string, city: string, state: string, pincode: number, user: string, typeOfAddress: string) {
        try {
            const result = await this.userRepository.addAddress(address, locality, city, state, pincode, user, typeOfAddress);
            return result;
        } catch (error) {
            console.error('Error in service layer:', error);
            throw new Error('Could not save address.');
        }
    }

    async getAddressByUser(userId: string) {
        try {
            return await this.userRepository.getAddressByUser(userId);
        } catch (error) {
            console.error('Address not fetched');
            throw new Error('Address not found')
        }
    }

    async fetchAddressSelected(addresId: string) {
        try {
            return await this.userRepository.fetchAddressSelected(addresId);
        } catch (error) {
            console.error('Address not fetched');
            throw new Error('Address not found')
        }
    }
}