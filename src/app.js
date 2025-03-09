// modules
import express from 'express';
import flash from 'connect-flash';
import passport from 'passport';
import GlobalMiddleware from './Middlewares/GlobalMiddleware.js';
import IndexRoutes from './routes/IndexRoutes.js';
import dotenv from 'dotenv';
dotenv.config();
// settings
import helmetConfig from './Settings/helmet.js';
import HandlebarsConfig from './Settings/Handlebars.js';
import Session from './Settings/session.js';
// Import authConfig from './config/auth.js';
// authConfig(passport);
// path settings
import path from 'path';
import { fileURLToPath } from 'url';
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
	}

	async middlewares() {
		// body parser
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.json());
		// session
		const sessionMiddleware = await Session.getSessionMiddleware();
		this.app.use(sessionMiddleware);
		this.app.use(passport.initialize());
		this.app.use(passport.session());
		this.app.use(flash());
		// helmet
		this.app.use(helmetConfig);
		// handlebars
		HandlebarsConfig.setup(this.app);
		// static files
		this.app.use(express.static(path.join(__dirname, '../public')));
		// global variables
		this.app.use(GlobalMiddleware.setGlobals);
	}

	routes() {
		this.app.use(IndexRoutes);
	}
}

const appInstance = new App();
export default appInstance.app;
