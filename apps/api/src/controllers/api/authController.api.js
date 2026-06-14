import bcrypt from 'bcrypt';
import { signToken } from '../../utils/jwt.js';
import * as UserModel from '../../models/user.model.js';

export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists in the database
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords (bcrypt)
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = signToken({ id: user.id, name: user.name, email: user.email });
        return res.json({ message: 'Login successful', token });
    } catch (err) {
        next(err);
    }
}

export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existing = await UserModel.findByEmail(email);
        if (existing) {
            return res.status(409).json({ message: 'An account with this email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await UserModel.create({ name, email, password: hashedPassword });

        // Generate JWT token
        const token = signToken({ id: user.id, name: user.name, email: user.email });
        return res.status(201).json({ message: 'Registration successful', token });
    } catch (err) {
        next(err);
    }
}

export async function logout(req, res) {
    return res.status(200).json({ message: 'Logged out.' });
}