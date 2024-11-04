import Order from '../models/order.model.js';
import mongoose from 'mongoose';

// Get all orders
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'username email').populate('products.productId', 'name price');
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid order ID" });
    }

    try {
        const order = await Order.findById(id).populate('userId', 'username email').populate('products.productId', 'name price');
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error("Error fetching order:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Create new order
export const createOrder = async (req, res) => {
    const { userId, products } = req.body;

    const totalAmount = products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Order({
        userId,
        products,
        totalAmount
    });

    try {
        await newOrder.save();
        res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        console.error("Error creating order:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid order ID" });
    }

    if (!['pending', 'shipped', 'delivered', 'canceled'].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        console.error("Error updating order:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Delete order
export const deleteOrder = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid order ID" });
    }

    try {
        await Order.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Order deleted" });
    } catch (error) {
        console.error("Error deleting order:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
