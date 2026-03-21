import express from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import apiRoutes from './routes/api.js';
import webRoutes from './routes/web.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { detectSection } from './middlewares/section.js';

const app = express();

// --- Security & Perf Middleware ---
app.use(helmet());           // Sets secure HTTP headers
app.use(compression());      // Gzip responses
app.use(morgan('dev'));       // Request logging

// --- Body Parsing ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Static Files ---
app.use(express.static('public'));

app.use(detectSection);

// --- Handlebars Setup ---
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'src/views/layouts',
    partialsDir: 'src/views/partials',
    helpers: {
        formatDate: (date) => new Date(date).toLocaleDateString(),
        eq: (a, b) => a === b,
    },
}));
app.set('view engine', 'hbs');
app.set('views', 'src/views');

// --- Routes ---
app.use('/api/v1', apiRoutes);
app.use('/', webRoutes);

// --- Error Handler (must be last) ---
app.use(errorHandler);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;