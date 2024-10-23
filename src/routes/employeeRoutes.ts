import express from 'express';
import { employeeController } from '../controllers/employeeController';
import { authMiddleware } from '../middlewares/userAuth';


const router = express.Router();

router.post('/signup', employeeController.signup);
router.post('/verify-otp', employeeController.verifyOtp);
router.post('/resend-otp', employeeController.resendOtp);
router.post('/login',employeeController.employeeLogin);
router.post('/addTimeslots',employeeController.timeslotCreation);
router.get('/get-timeslots/:id',employeeController.getTimeslots);
router.get('/get-employeeDetails/:id',employeeController.getEmployeeDetails);
router.delete('/delete-timeslots/:id',employeeController.deleteTimeslots);
router.delete('/delete-timeslotsById/:id',employeeController.deleteTimeslotsById);


export default router;