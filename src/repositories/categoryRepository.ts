import { ICategoryRepository } from "../interfaces/categoryInterface";
import { Category, ICategory } from "../models/categoryModel";

class CategoryRepository implements ICategoryRepository {
    async addCategory(categoryName: string, imageUrl: string) {
        
        const category = new Category({
            name: categoryName,
            image: imageUrl,
        });

        const saved = await category.save();
        return saved.toObject() as unknown as ICategory;
    }

    async findById(id: string): Promise<ICategory | null> {
        const category = await Category.findById(id).lean(); 
        return category as ICategory | null; 
    }

    async findAll(): Promise<ICategory[]> {
        const categories = await Category.find().lean().exec();  
        return categories as ICategory[]; 
    }

    async updateById(id: string, updateData: { name: string; image: string }): Promise<ICategory | null> {
        const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true }).lean(); 
        return updatedCategory as ICategory | null; 
    }

    async delete(id: string) { 
        await Category.findByIdAndDelete(id);
    }
}

export const categoryRepository = new CategoryRepository();