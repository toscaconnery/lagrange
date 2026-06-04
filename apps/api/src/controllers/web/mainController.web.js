export const homePage = async (req, res, next) => {
    try {
        res.render('home', {
            title: 'Home',
        });
    } catch (error) {
        next(error);
    }
};