import mongoose from "mongoose";
import Product from "../models/product.model.js";
import { deleteImage, isValidImage, validateProductFields } from "../utils/product.utils.js";

export const getProductById = async (id) => {
    try {
        const product = await Product.findById(id);
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.log("error in fetching finding product by id:", error.message);
        res.status(500).json({ success: false, message: "Not found" });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.log("error in fetching products:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const createProduct = async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error in Create product:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, quantity } = req.body;

        // Find the product by ID
        let product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Validate product fields
        const validation = validateProductFields(req.body);
        if (!validation.success) {
            return res.status(400).json(validation);
        }

        // Handle image update if a new image is provided
        let updatedImagePath = product.image;
        if (req.file) {
            // Validate if the uploaded file is a valid image
            if (!isValidImage(req.file)) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Only image files (PNG, JPG, JPEG) are allowed!",
                    });
            }

            // Delete the old image if it exists
            if (product.image) {
                deleteImage(product.image);
            }

            // Set the new image path
            updatedImagePath = req.file.filename;
        }

        // Create the updated product object
        const updatedProductData = {
            name,
            price: +price,
            image: updatedImagePath, 
            quantity: +quantity,
        };

        // Update the product in the database
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updatedProductData,
            {
                new: true,
            }
        );

        // Return the updated product
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
            .status(404)
            .json({ success: false, message: "Invalid Product Id" });
    }

    try {
        const product = await Product.findByIdAndDelete(id);
        if (product.image) {
            deleteImage(product.image);
        }        // await Product.findByIdAndUpdate(id, {
        // 	deleteAt: new Date()
        // });
        res.status(200).json({ success: true, message: "Product delete sucessfully" });
    } catch (error) {
        console.log("error in deleting product:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
