const config = require('./config/config');
const redis = require('./services/redis');
const book = require('./models/book');
const mongoDb = require('./services/mongoDb');
var Filter = require('bad-words'),
    filter = new Filter({placeHolder: '*'});
const fs = require('fs');

if ( fs.existsSync( config.app.badWordsFile )){
  let text = fs.readFileSync( config.app.badWordsFile, 'utf8' );
  let badWords = text.split('\n');
  //filter.addWords(...badWords);
}

async function handleReview( review ){
  if ( !review.book )
    return;

  let bookId;
  bookId = review.book;
  delete review.book;

  review.status = filter.isProfane( review.description ) ? "Rejected" : "Accepted";
  try {
    book.addReview(bookId, review);
  } catch( err ){
    console.error(err);
  }
}

async function readOneReview() {
    try {
      let data = await redis.recv(config.app.reviewsQueue, 0);
      return JSON.parse(data[1]);
    } catch (err) {
      console.error(err);
    }
}

async function readReviews() {
  while(true){
    let review = await readOneReview();
    handleReview(review);
    console.log(review);
  }
}

readReviews();
