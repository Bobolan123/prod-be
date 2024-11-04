import express from 'express';
import { registerUser, loginUser, getUsers, updateUserRole, deleteUser } from '../controllers/user.controller.js';
import authorization from '../middlewares/authorization.js';

const router = express.Router();

// POST register new user
router.post('/register', registerUser);

// POST login user
router.post('/login', loginUser);

// GET all users
router.get('/',authorization(['admin']), getUsers);

// PUT update user role
router.put('/:id/role', updateUserRole);

// DELETE user
router.delete('/:id', deleteUser);

export default router;
