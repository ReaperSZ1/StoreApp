import express from 'express';
import flash from 'connect-flash';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import passport from 'passport';
import csurf from 'csurf';

// Load environment variables
dotenv.config();

// Strategies
import './strategies/passport-google.js';
import './strategies/passport-facebook.js';

// Middlewares
import { setGlobals } from './Middlewares/global.middleware.js';
import { checkAuth } from './Middlewares/check-auth.middleware.js';
import { helmetMiddleware } from './Settings/helmet.config.js';

// Settings
import { HandlebarsConfig } from './Settings/handlebars.config.js';
import { getSessionMiddleware } from './Settings/session.config.js';

// Routes
import googleAuthRoutes from './Routes/google-auth.routes.js';
import facebookAuthRoutes from './Routes/facebook-auth.routes.js';
import homeRoutes from './Routes/home-routes.js';
import authRoutes from './Routes/auth.routes.js';
import favoritesRoutes from './Routes/favorite.routes.js';
import productRoutes from './Routes/product.routes.js';
import cartRoutes from './Routes/cart.routes.js';
import testRoutes from './Routes/test.routes.js';

// Path settings
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class App {
	constructor() {
		this.app = express();
		this.init();
	}

	async init() {
        this.app.set('trust proxy', 1); // Necessário para funcionar com proxy do Render
		await this.middlewares();
		this.routes();
	}

	async middlewares() {
		// Body parser
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.json());

		// Session
		const sessionMiddleware = await getSessionMiddleware();
		this.app.use(sessionMiddleware);

		// Passport
		this.app.use(passport.initialize());
		this.app.use(passport.session());

		// Cookie Parser
		this.app.use(cookieParser());

		// Check auth
		this.app.use(checkAuth);

       // Middleware CSRF, but only authenticated users
        this.app.use((req, res, next) => {
            if (req.session?.isLoggedIn) {
                csurf({ cookie: true })(req, res, next);
            } else {
                next();
            }
        });       
            
		// Flash
		this.app.use(flash());

		// Helmet
		this.app.use(helmetMiddleware);

		// Handlebars
		HandlebarsConfig(this.app);

		// Static files
		this.app.use(express.static(path.join(__dirname, '../public')));

		// Global variables
		this.app.use(setGlobals);
	}

	routes() {
		this.app.use('/', homeRoutes);
		this.app.use('/api/auth', authRoutes);
		this.app.use(googleAuthRoutes);
		this.app.use(facebookAuthRoutes);
		this.app.use(favoritesRoutes);
		this.app.use(productRoutes);
        this.app.use('/cart',cartRoutes);
        this.app.use('/test',testRoutes);
	}
}

const appInstance = new App();
export default appInstance.app;
