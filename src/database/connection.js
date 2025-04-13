import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Configura a conexão com o banco de dados MySQL
const sequelize = new Sequelize(process.env.MYSQL_URI, {
  dialect: 'mysql',
  logging: false // Desativa o log SQL (opcional)
});

export default sequelize;
