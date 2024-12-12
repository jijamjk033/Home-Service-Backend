import { Request, Response } from "express";
import { createSuccessResponse, createErrorResponse } from "../helpers/responseHelper";
import { StatusCodes } from "http-status-codes";
import { CustomMulterRequest } from "../config/multer";
import imageUpload from "../helpers/imageUpload";
import { categoryService } from "../services/categoryService";
import { ICategoryController } from "../interfaces/categoryInterface";

class CategoryController implements ICategoryController {

  async addCategory(req: CustomMulterRequest, res: Response) {
    const categoryName = req.body.categoryName;
    const image = req.files?.image?.[0];
    try {
      if (!image) {
        throw new Error("Image file is required");
      }

      const imageUrl = await imageUpload.uploadImage(image.path);

      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }

      const result = await categoryService.addCategory(categoryName, imageUrl);

      res.status(StatusCodes.OK).json(createSuccessResponse(result));
    } catch (err) {
      if (err instanceof Error) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json(createErrorResponse(err.message));
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json(createErrorResponse("An unknown error occurred"));
      }
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(StatusCodes.OK).json({
        data: categories,
        message: "Categories fetched successfully",
      });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Error fetching categories", error });
    }
  }

  async getCategoryById(req: Request, res: Response) {
    try {
      const categoryId = req.params.id;
      const category = await categoryService.getCategoryById(categoryId);
      res.status(StatusCodes.OK).json({
        success: true,
        data: category,
        message: "Category fetched successfully",
      });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Error fetching category", error });
    }
  }

  async updateCategory(req: CustomMulterRequest, res: Response) {
    try {
      const categoryId = req.params.id;
      const categoryName = req.body.categoryName;
      const image = req.files?.image?.[0];
      if (!image) {
        throw new Error("Image file is required");
      }
      const imageUrl = await imageUpload.uploadImage(image.path);

      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }
      const updatedCategory = await categoryService.updateCategoryById(
        categoryId,
        categoryName,
        imageUrl
      );
      res.status(StatusCodes.OK).json({
        success: true,
        data: updatedCategory,
        message: "Category updated successfully",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Error updating category",
      });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const categoryId = req.params.id;
      await categoryService.deleteCategoryById(categoryId);
      res
        .status(StatusCodes.OK)
        .json({ message: "Category deleted successfully" });
    } catch (error) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Error deleting category", error });
    }
  }
}

export const categoryController = new CategoryController();
