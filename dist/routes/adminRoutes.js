"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const multer_1 = require("../config/multer");
const categoryController_1 = require("../controllers/categoryController");
const servicesController_1 = require("../controllers/servicesController");
const userAuth_1 = require("../middlewares/userAuth");
const router = express_1.default.Router();
router.post('/login', adminController_1.adminController.adminLogin);
router.get('/user-list', userAuth_1.authMiddleware.checkAuthorization(['admin']), adminController_1.adminController.getUsers);
router.get('/employee-list', userAuth_1.authMiddleware.checkAuthorization(['admin']), adminController_1.adminController.getEmployees);
router.post('/add-category', userAuth_1.authMiddleware.checkAuthorization(['admin']), multer_1.upload.fields([{ name: 'image', maxCount: 1 }]), (req, res) => {
    categoryController_1.categoryController.addCategory(req, res);
});
router.get('/categories', userAuth_1.authMiddleware.checkAuthorization(['admin']), categoryController_1.categoryController.getCategories);
router.delete('/delete-category/:id', categoryController_1.categoryController.deleteCategory);
router.get('/get-category/:id', categoryController_1.categoryController.getCategoryById);
router.put('/update-category/:id', multer_1.upload.fields([{ name: 'image', maxCount: 1 }]), (req, res) => {
    categoryController_1.categoryController.updateCategory(req, res);
});
router.post('/add-service', multer_1.upload.fields([{ name: 'image', maxCount: 1 }]), (req, res) => {
    servicesController_1.serviceController.addServices(req, res);
});
router.get('/get-services/:id', servicesController_1.serviceController.getServiceById);
router.put('/update-service/:id', multer_1.upload.fields([{ name: 'image', maxCount: 1 }]), (req, res) => {
    servicesController_1.serviceController.updateService(req, res);
});
router.get('/get-servicebyId/:id', servicesController_1.serviceController.getServiceByServiceId);
router.delete('/delete-service/:id', servicesController_1.serviceController.deleteService);
exports.default = router;
