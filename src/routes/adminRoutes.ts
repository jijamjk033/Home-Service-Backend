import express from 'express';
import { adminController } from '../controllers/adminController';
import { CustomMulterRequest, upload } from '../config/multer';
import { categoryController } from '../controllers/categoryController';
import { serviceController } from '../controllers/servicesController';
import { authMiddleware } from '../middlewares/userAuth';


const router = express.Router();

router.post('/login',adminController.adminLogin);
router.get('/user-list', authMiddleware.checkAuthorization(['admin']), adminController.getUsers);
router.get('/employee-list', adminController.getEmployees);

router.post('/add-category',upload.fields([{ name: 'image', maxCount: 1 }]), (req, res) => {
    categoryController.addCategory(req as CustomMulterRequest, res);
});

router.get('/categories', categoryController.getCategories);
router.delete('/delete-category/:id', categoryController.deleteCategory);
router.get('/get-category/:id', categoryController.getCategoryById);
router.put('/update-category/:id', upload.fields([{ name: 'image', maxCount: 1 }]), (req, res) => {
    categoryController.updateCategory(req as CustomMulterRequest, res);
});

router.post('/add-service',upload.fields([{ name: 'image', maxCount: 1 }]), (req, res) => {
    serviceController.addServices(req as CustomMulterRequest, res);
});
router.get('/get-services/:id', serviceController.getServiceById);
router.put('/update-service/:id',upload.fields([{ name: 'image', maxCount: 1 }]), (req, res) => {
    serviceController.updateService(req as CustomMulterRequest, res);
});
router.get('/get-servicebyId/:id',serviceController.getServiceByServiceId)
router.delete('/delete-service/:id', serviceController.deleteService);


export default router;