import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

class ImageUpload {
    async uploadImage(filePath: string): Promise<string | null> {
        try {
            const uploadOptions = {
                transformation: {
                    width: 300,
                    height: 300,
                    crop: 'fill'
                }
            };

            const uploadedImage = await cloudinary.uploader.upload(filePath, uploadOptions);
            return uploadedImage.secure_url;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    }

}

export default new ImageUpload();