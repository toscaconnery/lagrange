export const detectSection = (req, res, next) => {
    res.locals.isPoolSection = req.originalUrl.startsWith('/pools');
    res.locals.isUserSection = req.originalUrl.startsWith('/users');
    next();
};