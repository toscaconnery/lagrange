import * as UserModel from '../../models/userModel.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await UserModel.findAllUsers();
        res.json({ success: true, data: users });
    } catch (err) {
        next(err); // pass to error handler
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await UserModel.findUserById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

export const createUser = async (req, res, next) => {
    try {
        console.log('--- creating user')
        const { name, email } = req.body;
        console.log('--- name, email', name, email)

        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required.' });
        }

        const id = await UserModel.createUser({ name, email });
        res.status(201).json({ success: true, data: { id, name, email } });
    } catch (err) {
        next(err);
    }
};