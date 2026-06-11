import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import config from './config/index.js';
import apiRoutes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.use('/api', apiRoutes);

// The owner's admin app — a single page served by this same server.
// Open http://localhost:5000/admin while the backend is running.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

app.use(notFound);
app.use(errorHandler);

export default app;
