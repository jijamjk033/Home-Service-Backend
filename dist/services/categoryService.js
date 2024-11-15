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
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const categoryRepository_1 = require("../repositories/categoryRepository");
class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    addCategory(categoryName, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.categoryRepository.addCategory(categoryName, imageUrl);
            return result;
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.categoryRepository.findAll();
        });
    }
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryRepository.findById(id);
            if (!category) {
                throw new Error('Category not found');
            }
            return category;
        });
    }
    updateCategoryById(id, categoryName, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCategory = yield this.categoryRepository.updateById(id, {
                name: categoryName,
                image: imageUrl,
            });
            return updatedCategory;
        });
    }
    deleteCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryRepository.findById(id);
            if (!category) {
                throw new Error('Category not found');
            }
            yield this.categoryRepository.delete(id);
        });
    }
}
exports.categoryService = new CategoryService(categoryRepository_1.categoryRepository);
