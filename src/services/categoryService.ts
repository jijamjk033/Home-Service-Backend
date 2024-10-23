import { ICategoryRepository } from "../interfaces/categoryInterface";
import { categoryRepository } from "../repositories/categoryRepository";

class CategoryService{
    private categoryRepository:ICategoryRepository;
    constructor(categoryRepository:ICategoryRepository){
        this.categoryRepository = categoryRepository;
    }

    async addCategory(categoryName: string, imageUrl: string) {

        const result = await this.categoryRepository.addCategory(categoryName, imageUrl);
        return result;
    }

    async getAllCategories() {
        return this.categoryRepository.findAll();
    }

    async getCategoryById(id: string) {

        const category = await this.categoryRepository.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }

    async updateCategoryById(id: string, categoryName: string, imageUrl: string) {
        const updatedCategory = await this.categoryRepository.updateById(id, {
            name: categoryName,
            image: imageUrl,
        });
        return updatedCategory;
    }

    async deleteCategoryById(id: string) {
        const category = await this.categoryRepository.findById(id);

        if (!category) {
            throw new Error('Category not found');
        }

        await this.categoryRepository.delete(id);
    }
}

export const categoryService = new CategoryService(categoryRepository);