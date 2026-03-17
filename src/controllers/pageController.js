import * as UserModel from '../models/userModel.js';

export const homePage = async (req, res, next) => {
    try {
        const users = await UserModel.findAllUsers();
        res.render('home', {
            title: 'Home',
            users,
        });
    } catch (err) {
        next(err);
    }
};

export const addUser = async (req, res, next) => {
    try {
        res.render('add-user', {
            title: 'Add User',
            // users,
        });
    } catch (err) {
        next(err)
    }
}