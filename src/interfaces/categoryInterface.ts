import { ICategory } from "../models/categoryModel";
import { Request, Response } from "express";

export interface ICategoryController {
    addCategory(req: Request, res: Response): Promise<void>;
    getCategories(req: Request, res: Response): Promise<void>;
    getCategoryById(req: Request, res: Response): Promise<void>;
    updateCategory(req: Request, res: Response): Promise<void>;
    deleteCategory(req: Request, res: Response): Promise<void>;
}

export interface ICategoryService {
    addCategory(categoryName: string, imageUrl: string): Promise<ICategory>;
    getAllCategories(): Promise<ICategory[]>;
    getCategoryById(id: string): Promise<ICategory>;
    updateCategoryById(
        id: string,
        categoryName: string,
        imageUrl: string
    ): Promise<ICategory | null>;
    deleteCategoryById(id: string): Promise<void>;
}

export interface ICategoryRepository {
    addCategory(categoryName: string, imageUrl: string): Promise<ICategory>;
    findById(id: string): Promise<ICategory | null>;
    findAll(): Promise<ICategory[]>;
    updateById(id: string, updateData: { name: string; image: string }): Promise<ICategory | null>;
    delete(id: string): Promise<void>;
}