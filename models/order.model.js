import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId, // Reference to the User model
			ref: "User",
			required: true,
		},
		products: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
					ref: "Product",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				price: {
					type: Number, // Store the price at the time of purchase
					required: true,
				},
			},
		],
		totalAmount: {
			type: Number, // Total order amount
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "shipped", "delivered", "canceled"], // Order status
			default: "pending",
		},
		orderDate: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true, // createdAt, updatedAt
	}
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
