import { verifyToken } from '../utils/jwt.js';

export function requireAuth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/auth/login');
    }

    try {
        const decoded = verifyToken(token);
        res.locals.user = decoded;
        next();
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/auth/login');
    }
}