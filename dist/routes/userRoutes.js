"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.post('/signup', userController_1.userController.signup);
router.post('/verify-otp', userController_1.userController.verifyOtp);
router.post('/resend-otp', userController_1.userController.resendOtp);
router.post('/login', userController_1.userController.userLogin);
router.post('/add-address', userController_1.userController.addAddress);
router.get('/get-address/:id', userController_1.userController.getAddress);
router.get('/get-timeslot/:id', userController_1.userController.getTimeslots);
router.get('/fetch-timeslots/:id', userController_1.userController.fetchTimeSlots);
router.get('/fetch-address/:id', userController_1.userController.fetchAddressSelected);
router.post('/booking', userController_1.userController.createBooking);
exports.default = router;
