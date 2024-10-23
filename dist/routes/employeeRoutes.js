"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../controllers/employeeController");
const router = express_1.default.Router();
router.post('/signup', employeeController_1.employeeController.signup);
router.post('/verify-otp', employeeController_1.employeeController.verifyOtp);
router.post('/resend-otp', employeeController_1.employeeController.resendOtp);
router.post('/login', employeeController_1.employeeController.employeeLogin);
router.post('/addTimeslots', employeeController_1.employeeController.timeslotCreation);
router.get('/get-timeslots/:id', employeeController_1.employeeController.getTimeslots);
router.get('/get-employeeDetails/:id', employeeController_1.employeeController.getEmployeeDetails);
router.delete('/delete-timeslots/:id', employeeController_1.employeeController.deleteTimeslots);
router.delete('/delete-timeslotsById/:id', employeeController_1.employeeController.deleteTimeslotsById);
exports.default = router;
