export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const status = err.status ?? 500;
    const isApi = req.path.startsWith('/api');

    if (isApi) {
        return res.status(status).json({
        success: false,
        message: err.message ?? 'Internal Server Error',
        });
    }

    // Fallback: if the error view itself is missing, send plain HTML
    try {
        res.status(status).render('error', {
            title: 'Error',
            status,
            message: err.message ?? 'Something went wrong',
        });
    } catch (_) {
        res.status(status).send(`<h1>Error ${status}</h1><p>${err.message}</p>`);
    }
};