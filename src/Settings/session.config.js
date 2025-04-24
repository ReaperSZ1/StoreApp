import session from 'express-session';
import { createRequire } from 'module';
import { getConnection } from '../Database/connection.js';
const require = createRequire(import.meta.url);
const MySQLStore = require('express-mysql-session')(session);
import dotenv from 'dotenv';
dotenv.config();

async function initStore() {
    const db = await getConnection();
    return new MySQLStore({}, db);
}

export const getSessionMiddleware = async () => {
    const store = await initStore();

    return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 3600000
    },
    store: store
    });
};