import express from "express";
import multer from "multer";
import path from "path";
import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from "../controllers/product.controller.js";
import {
    isValidImage,
    deleteImage,
    validateProductFields,
} from "../utils/product.utils.js";
import authorization from "../middlewares/authorization.js";

const router = express.Router();

// Configure multer storage and custom filename
const storage = multer.diskStorage({
    destination: "./public/products",
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();
        const newFileName = file.fieldname + "-" + uniqueSuffix + ext;
        cb(null, newFileName);
    },
});

const upload = multer({ storage: storage });

// POST route - Create a new product
router.post(
    "/",
    authorization("admin"),
    upload.single("image"), // Handle image upload
    (req, res) => {
        try {
            const { name, price, quantity } = req.body;

            // Validate product fields
            const validation = validateProductFields(req.body);
            if (!validation.success) {
                return res.status(400).json(validation);
            }

            // Validate image file
            if (!isValidImage(req.file)) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Only image files (PNG, JPG, JPEG) are allowed!",
                    });
            }

            // Create new product object
            const newProduct = {
                name,
                price: +price,
                image: req.file.filename,
                quantity: +quantity,
            };

            req.body = newProduct; // Set new product in request body
            createProduct(req, res);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: "Server error, could not upload product.",
            });
        }
    }
);

// PUT route - Update a product
router.put("/:id",authorization("admin"), upload.single("image"), updateProduct);

router.get("/",  getProducts);
router.delete("/:id",authorization("admin"), deleteProduct);

export default router;
