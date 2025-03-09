import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class HandlebarsConfig {
    static setup(app) {
        app.engine(
            'handlebars',
            handlebars.engine({
                defaultLayout: 'main',
                partialsDir: path.join(__dirname, '../views/partials'),
                runtimeOptions: {
                    allowProtoPropertiesByDefault: true,
                    allowProtoMethodsByDefault: true
                }
            })
        );
        app.set('views', path.join(__dirname, '../views'));
        app.set('view engine', 'handlebars');
    }
}

export default HandlebarsConfig;
