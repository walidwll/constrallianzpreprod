import next from 'next';
import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { initializeScheduler } from './scheduler.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
    const server = express();
    const httpServer = http.createServer(server);
    
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Initialize the scheduler after MongoDB connection
        initializeScheduler();
        console.log('Scheduler initialized');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    const PORT = process.env.PORT || 3000;
    httpServer.listen(PORT, () => {
        console.log(`Server is running on ${process.env.NEXT_PUBLIC_API_URL || `http://localhost:${PORT}`}`);
    });
}).catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
});