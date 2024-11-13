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
exports.categoryRepository = void 0;
const categoryModel_1 = require("../models/categoryModel");
class CategoryRepository {
    addCategory(categoryName, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = new categoryModel_1.Category({
                name: categoryName,
                image: imageUrl,
            });
            const saved = yield category.save();
            return saved.toObject();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield categoryModel_1.Category.findById(id).lean();
            return category;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield categoryModel_1.Category.find().lean().exec();
            return categories;
        });
    }
    updateById(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCategory = yield categoryModel_1.Category.findByIdAndUpdate(id, updateData, { new: true }).lean();
            return updatedCategory;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield categoryModel_1.Category.findByIdAndDelete(id);
        });
    }
}
exports.categoryRepository = new CategoryRepository();
