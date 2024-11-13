import express from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/userAuth';

const router = express.Router();



router.post('/signup', userController.signup);
router.post('/verify-otp', userController.verifyOtp);
router.post('/resend-otp', userController.resendOtp);
router.post('/login',userController.userLogin);
router.post('/add-address',userController.addAddress);
router.get('/get-address/:id',userController.getAddress);
router.get('/get-timeslot/:id',userController.getTimeslots);
router.get('/fetch-timeslots/:id', userController.fetchTimeSlots);
router.get('/fetch-address/:id',userController.fetchAddressSelected);
router.post('/booking',userController.createBooking);



export default router;