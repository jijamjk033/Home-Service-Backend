import express from 'express';
import { userController } from '../controllers/userController';
import { bookingController } from '../controllers/bookingController';
import { addressController } from '../controllers/addressController';
import { timeslotController } from '../controllers/timeslotController';

const router = express.Router();

router.post('/signup',userController.signup);
router.post('/verify-otp',userController.verifyOtp);
router.post('/resend-otp',userController.resendOtp);
router.post('/login',userController.userLogin);
router.get('/get-user/:id',userController.getUserDetails);
router.post('/add-address',addressController.addAddress);
router.get('/get-address/:id',addressController.getAddress);
router.get('/get-timeslot/:id',timeslotController.getTimeslotByid);
router.get('/fetch-timeslots/:id',timeslotController.fetchTimeSlots);
router.get('/fetch-address/:id',addressController.fetchAddressSelected);
router.post('/booking',bookingController.createBooking);
router.get('/getBookingList/:id', bookingController.getBookingList);
router.get('/getBookingDetails/:id', bookingController.getBookingDetails);
router.post('/cancelBooking/:id', bookingController.cancelBooking);
router.get('/get-transactions/:id',userController.getUserTransactions);


export default router;