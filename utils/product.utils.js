import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

// Validate that the provided file is a valid image type
export const isValidImage = (file) => {
    if (!file) return false;
    const allowedExts = ['.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    return allowedExts.includes(ext);
};

// Delete an image from the file system
export const deleteImage = (imagePath) => {
    const filePath = path.join(__dirname, '/public/products', imagePath);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

// Validate product fields (name, price, quantity)
export const validateProductFields = ({ name, price, quantity }) => {
    if (!name || !price || !quantity) {
        return { success: false, message: 'Please provide all fields' };
    }
    return { success: true };
};
