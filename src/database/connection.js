import mysql from 'mysql2/promise';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

class Database {
    constructor() {
        this.connection = null;
        this.sequelize = new Sequelize(
            process.env.DB_NAME, 
            process.env.DB_USER, 
            process.env.DB_PASS, 
            {
                host: process.env.DB_HOST,
                dialect: 'mysql',
                logging: false
            }
        );
    }

    async connect() {
        if (!this.connection) {
            try {
                this.connection = await mysql.createPool({ 
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
                console.error('❌ Erro ao conectar ao banco de dados', error);
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

    getSequelizeInstance() {
        return this.sequelize;
    }
}

const database = new Database();
export default database;
export const sequelize = database.getSequelizeInstance(); 
export const getConnection = () => database.getConnection(); 
