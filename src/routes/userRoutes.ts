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



export default router;