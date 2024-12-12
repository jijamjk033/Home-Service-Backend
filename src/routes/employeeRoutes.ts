import express from 'express';
import { employeeController } from '../controllers/employeeController';
import { bookingController } from '../controllers/bookingController';
import { timeslotController } from '../controllers/timeslotController';


const router = express.Router();

router.post('/signup', employeeController.signup);
router.post('/verify-otp', employeeController.verifyOtp);
router.post('/resend-otp', employeeController.resendOtp);
router.post('/login',employeeController.employeeLogin);
router.post('/addTimeslots',timeslotController.timeslotCreation);
router.get('/get-timeslots/:id',timeslotController.getTimeslots);
router.get('/get-employeeDetails/:id',employeeController.getEmployeeDetails);
router.delete('/delete-timeslots/:id',timeslotController.deleteTimeslots);
router.delete('/delete-timeslotsById/:id',timeslotController.deleteTimeslotsById);
router.put('/updateStatus/:id', bookingController.updateStatus);
router.get('/getBookingsEmployees/:id',bookingController.getEmployeeBookings);

export default router;