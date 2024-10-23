"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const responseHelper_1 = require("../helpers/responseHelper");
const http_status_codes_1 = require("http-status-codes");
const imageUpload_1 = __importDefault(require("../helpers/imageUpload"));
const categoryService_1 = require("../services/categoryService");
class CategoryController {
    addCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const categoryName = req.body.categoryName;
            const image = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b[0];
            try {
                if (!image) {
                    throw new Error("Image file is required");
                }
                const imageUrl = yield imageUpload_1.default.uploadImage(image.path);
                if (!imageUrl) {
                    throw new Error("Failed to upload image");
                }
                const result = yield categoryService_1.categoryService.addCategory(categoryName, imageUrl);
                res.status(http_status_codes_1.StatusCodes.OK).json((0, responseHelper_1.createSuccessResponse)(result));
            }
            catch (err) {
                if (err instanceof Error) {
                    res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json((0, responseHelper_1.createErrorResponse)(err.message));
                }
                else {
                    res
                        .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                        .json((0, responseHelper_1.createErrorResponse)("An unknown error occurred"));
                }
            }
        });
    }
    getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categoryService_1.categoryService.getAllCategories();
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    data: categories,
                    message: "Categories fetched successfully",
                });
            }
            catch (error) {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ message: "Error fetching categories", error });
            }
        });
    }
    getCategoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.id;
                const category = yield categoryService_1.categoryService.getCategoryById(categoryId);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    data: category,
                    message: "Category fetched successfully",
                });
            }
            catch (error) {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ message: "Error fetching category", error });
            }
        });
    }
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const categoryId = req.params.id;
                const categoryName = req.body.categoryName;
                const image = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b[0];
                if (!image) {
                    throw new Error("Image file is required");
                }
                const imageUrl = yield imageUpload_1.default.uploadImage(image.path);
                if (!imageUrl) {
                    throw new Error("Failed to upload image");
                }
                const updatedCategory = yield categoryService_1.categoryService.updateCategoryById(categoryId, categoryName, imageUrl);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    success: true,
                    data: updatedCategory,
                    message: "Category updated successfully",
                });
            }
            catch (error) {
                console.error("Error updating category:", error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Error updating category",
                });
            }
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.id;
                yield categoryService_1.categoryService.deleteCategoryById(categoryId);
                res
                    .status(http_status_codes_1.StatusCodes.OK)
                    .json({ message: "Category deleted successfully" });
            }
            catch (error) {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ message: "Error deleting category", error });
            }
        });
    }
}
exports.categoryController = new CategoryController();
