import session from 'express-session';
import { createRequire } from 'module';
import Database from './Database.js';

const require = createRequire(import.meta.url);
const MySQLStore = require('express-mysql-session')(session);

class Session {
    constructor() {
        this.store = null;
    }

    async init() {
        const db = await Database.getConnection(); // Aguarda conexão com o banco
        this.store = new MySQLStore({}, db);
    }

    async getSessionMiddleware() {
        if (!this.store) {
            await this.init(); // Inicializa a sessão caso ainda não esteja pronta
        }

        return session({
            secret: process.env.SESSION_SECRET || 'jooj',
            resave: false,
            saveUninitialized: false,
            cookie: { httpOnly: true },
            store: this.store
        });
    }
}

export default new Session();
