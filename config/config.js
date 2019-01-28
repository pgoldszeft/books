const fs = require('fs');

let privateKey = fs.readFileSync("./config/private.key");

let config = {
	db : {
		url: "mongodb://localhost",
		name: "BooksProject"
	},
	jwt : {
		privateKey: privateKey.toString(),
		expiresIn: 604800		// 1 week
	},
	server: {
		port: 3000
	},
	redisStore: {
		url: "redis://127.0.0.1",
		secret: "kLKtQcBsp4"
	}
};

module.exports = config;
