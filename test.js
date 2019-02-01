const redis = require("./services/redis");
const config = require('./config/config');

let counter = 1;
setInterval( () => {
	let review = {
	  user: "5c4c7379ec65ae0b0c782a8e",
	  rating: 90,
	  status: "Accepted",
	  description: "It's a good book" + (counter++).toString(),
	  book: "5c52014090770a49a0d7c75d"
	}
	redis.send( config.app.reviewsQueue, JSON.stringify(review) );
}, 1000 );
