import * as UserModel from '../models/userModel.js';

export const homePage = async (req, res, next) => {
    try {
        res.render('home', {
            title: 'Home',
        });
    } catch (error) {
        next(error);
    }
};

export const listUser = async (req, res, next) => {
    try {
        const users = await UserModel.findAllUsers();
        res.render('users/list-user', {
            title: 'List User',
            users
        })
    } catch (error) {
        next(error)
    }
}

export const addUser = async (req, res, next) => {
    try {
        res.render('users/add-user', {
            title: 'Add User',
            // users,
        });
    } catch (error) {
        next(error)
    }
}