/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import { Application } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFoundRoute from './app/middleware/notFoundRoute';
import { MiddlewareRoutes } from './app/route';
import cookieParser from 'cookie-parser';

const app: Application = express();
app.use(express.json());

// Fix: Removed the space in the URL and made CORS more flexible
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://192.168.10.141:3000',
      'https://taazafol.arviontech.online',
      // Add more origins as needed, or use a function to validate origins dynamically
    ],
    credentials: true,
  }),
);
 
// Fix: Added proper path and origin
app.options('*', cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use('/api/v1', MiddlewareRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to server');
});

app.use(
  globalErrorHandler as (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void,
);
app.use('*', notFoundRoute);

export default app;