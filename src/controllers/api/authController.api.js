import bcrypt from 'bcrypt';
import { signToken } from '../../utils/jwt.js';
import * as UserModel from '../../models/user.model.js';

export async function login(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = signToken({ id: user.id, email: user.email, role: user.role });

        return res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
}

export async function logout(req, res) {
    return res.status(200).json({ message: 'Logged out.' });
}