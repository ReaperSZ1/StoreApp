import express from 'express';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Local helpers
import GlobalMiddleware from './Middlewares/GlobalMiddleware.js';
import checkAuth from './Middlewares/checkAuth.js'; 
import helmetConfig from './Settings/helmet.js';
import HandlebarsConfig from './Settings/Handlebars.js';
import Session from './Settings/session.js';
import sequelize from './database/connection.js';

// Routes
import IndexRoutes from './Routes/IndexRoutes.js';
import authRoutes from './Routes/authRoutes.js';

// Path settings
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class App {
	constructor() {
		this.app = express();
		this.init();
	}

	async init() {
		await this.middlewares();
		this.routes();
		this.connectDatabase();
	}

	async middlewares() {
		// Body parser
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.json());

		// Session
		const sessionMiddleware = await Session.getSessionMiddleware();
		this.app.use(sessionMiddleware);

        // Cookie Parser
        this.app.use(cookieParser());

        // Check auth
        this.app.use(checkAuth);

        // Flash
		this.app.use(flash());

		// Helmet
		this.app.use(helmetConfig);

		// Handlebars
		HandlebarsConfig.setup(this.app);

		// Static files
		this.app.use(express.static(path.join(__dirname, '../public')));

		// Global variables
		this.app.use(GlobalMiddleware.setGlobals);
	}

	routes() {
		this.app.use('/', IndexRoutes);
		this.app.use('/api/auth', authRoutes); // Auth routes
	}

	connectDatabase() {
		sequelize
			.authenticate()
			.then(() => console.log('✅ MySQL connected'))
			.catch((err) => console.error('❌ MySQL error:', err));
	}
}

const appInstance = new App();
export default appInstance.app;
