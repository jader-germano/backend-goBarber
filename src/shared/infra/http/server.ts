import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import uploadConfig from '@config/upload.ts';
import AppError from '@shared/errors/AppError';
import routes from '@shared/infra/http/routes/routes';
import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

const PORT = 3333;

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(cors());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    return response.status(500).json({
        status: 'error',
        message: `Internal server error. Details: ${err}`,
    });
});

app.listen(3333, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started on port ${PORT}`);
});
