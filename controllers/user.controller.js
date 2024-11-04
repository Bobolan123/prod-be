import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Register new user
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("Error logging in user:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update user role
export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid user ID" });
    }

    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: "Invalid role" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Error updating user role:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid user ID" });
    }

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
