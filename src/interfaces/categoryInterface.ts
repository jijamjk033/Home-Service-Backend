import { ICategory } from "../models/categoryModel";

export interface ICategoryRepository {
    addCategory(categoryName: string, imageUrl: string): Promise<ICategory>;
    findById(id: string): Promise<ICategory | null>;
    findAll(): Promise<ICategory[]>;
    updateById(id: string, updateData: { name: string; image: string }): Promise<ICategory | null>;
    delete(id: string): Promise<void>;
}