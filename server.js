import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './src/config/db.js';

dotenv.config();

// Connect to Database
connectDB();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import userRoutes from './src/routes/userRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';

const app = express();

// Middleware
app.use(cors({
    origin: true, // Reflects the exact origin of the request
    credentials: true,
}));
app.use(express.json());

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.send('Sakhi Scents API is running...');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
