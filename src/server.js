import app from './app.js';
import database from './database/connection.js';

const PORT = 8081;
const ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
	if (ENV === 'development') {
		console.log(`🚀 Server running locally at http://localhost:${PORT}`);
	} else {
		console.log(`🌍 Server running in remote environment`);
	}
});

// Close connection correctly when shutting down
process.on('SIGINT', async () => {
    console.log('\n🛑 App closed...');
    await database.close(); 
    process.exit(0);
});