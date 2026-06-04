import bcrypt from 'bcrypt';
import { signToken } from '../../utils/jwt.js';
import * as UserModel from '../../models/user.model.js';

export async function getLogin(req, res, next) {
    if (req.cookies.token) return res.redirect('/');
    res.render('auth/login', { layout: 'auth' });
}

export async function getRegister(req, res, next) {
    if (req.cookies.token) return res.redirect('/');
    res.render('auth/register', { layout: 'auth' });
}

export async function postLogin(req, res, next) {
    const { email, password } = req.body;
    console.log('--- mark 1')
    console.log('--- ', email, password)

    try {
        const user = await UserModel.findByEmail(email);
        console.log('--- mark 2')
        if (!user) {
            console.log('--- mark 3')
            return res.render('auth/login', {
                layout: 'auth',
                error: 'Invalid email or password.'
            });
        }
        console.log('--- mark 4')

        const match = await bcrypt.compare(password, user.password);
        console.log('--- mark 5')
        if (!match) {
            console.log('--- mark 6')
            return res.render('auth/login', {
                layout: 'auth',
                error: 'Invalid email or password.'
            });
        }
        console.log('--- mark 7')

        const token = signToken({ id: user.id, name: user.name, email: user.email });
        console.log('--- mark 8')

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.redirect('/');
    } catch (err) {
        next(err);
    }
}

export async function postLogout(req, res) {
    res.clearCookie('token');
    res.redirect('/auth/login');
}

export async function postRegister(req, res, next) {
    const { name, email, password } = req.body;

    try {
        const user = await UserModel.findByEmail(email);
        if (user) {
            return res.render('auth/register', {
                layout: 'auth',
                error: 'User already registered.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({ name, email, password: hashedPassword });

        const token = signToken({ id: newUser.id, name: newUser.name, email: newUser.email});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.redirect('/pools');
    } catch (err) {
        next(err);
    }
}