import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        if (!this.connection) {
            try {
                this.connection = await mysql.createPool({ // Alterado para createPool
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASS,
                    database: process.env.DB_NAME,
                    waitForConnections: true,
                    connectionLimit: 10,
                    queueLimit: 0
                });
                console.log('✅ Conectado ao MySQL');
            } catch (error) {
                console.error('❌ Erro ao conectar ao banco de dados:', error);
                throw error;
            }
        }
        return this.connection;
    }

    async getConnection() {
        if (!this.connection) {
            await this.connect();
        }
        return this.connection;
    }
}

export default new Database();
