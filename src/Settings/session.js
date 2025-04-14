import session from 'express-session';
import { createRequire } from 'module';
import { getConnection } from '../database/connection.js';
const require = createRequire(import.meta.url);
const MySQLStore = require('express-mysql-session')(session);
import dotenv from 'dotenv';
dotenv.config();

class Session {
    constructor() {
        this.store = null;
    }

    async init() {
        const db = await getConnection(); 
        this.store = new MySQLStore({}, db);
    }

    async getSessionMiddleware() {
        if (!this.store) {
            await this.init(); // Inicializa a sessão caso ainda não esteja pronta
        }

        return session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: { httpOnly: true, maxAge: 3600000 },
            store: this.store
        });
    }
}

export default new Session();
