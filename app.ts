require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
export const app = express();
import cookieParser from 'cookie-parser';

import { errorMiddleware } from './middleware/error';
import indexRoutes from './routes/indexRoutes';


// body parser
app.use(express.json({ limit: '50mb' }))

// cookie parser
app.use(cookieParser());

// custom routes
app.use('/api', indexRoutes)

// unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.statusCode = 404;
    next(err);
});

app.use(errorMiddleware)