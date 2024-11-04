import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus, deleteOrder } from '../controllers/order.controller.js';

const router = express.Router();

// GET all orders
router.get('/', getOrders);

// GET order by ID
router.get('/:id', getOrderById);

// POST new order
router.post('/', createOrder);

// PUT update order status
router.put('/:id', updateOrderStatus);

// DELETE order
router.delete('/:id', deleteOrder);

export default router;
