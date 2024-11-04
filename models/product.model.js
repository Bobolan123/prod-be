import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		deleteAt: {
			type: Date,
			default: null
		},
	},
	{
		timestamps: true, // createdAt, updatedAt
	}
);

const Product = mongoose.model("Product", productSchema);

export default Product;
