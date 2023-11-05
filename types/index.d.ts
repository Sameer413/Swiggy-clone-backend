import * as express from 'express';
import { UserType } from './userTypes';

declare global {
    namespace Express {
        interface Request {
            user: UserType | null // Initialize as undefined
        }
    }
}