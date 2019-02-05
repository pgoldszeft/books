const fs = require('fs');

let privateKey = fs.readFileSync( process.env.PRIVATE_KEY_FILE || "./config/private.key");

let config = {
	app: {
		reviewsQueue: 'comments',
		badWordsFile: './config/badWords.txt'
	},
	db : {
		url: process.env.MONGO_URL || "mongodb://localhost/BooksProject",
		debug: process.env.MONGO_DEBUG || true
	},
	jwt : {
		privateKey: privateKey.toString(),
		expiresIn: process.env.TOKEN_TTL || 604800		// 1 week
	},
	server: {
		port: process.env.SERVER_PORT || 3000
	},
	redisStore: {
		url: process.env.REDIS_URL || "redis://127.0.0.1",
		secret: process.env.REDIS_SECRET || "kLKtQcBsp4"
	}
};

module.exports = config;
