const config = require('./config/config');
const redis = require('./services/redis');
const book = require('./models/book');
const mongoDb = require('./services/mongoDb');
var Filter = require('bad-words'),
    filter = new Filter({placeHolder: '*'});
const fs = require('fs');

async function handleReview( review ){
  if ( !review.book )
    return;

  let bookId;
  bookId = review.book;
  delete review.book;

  review.status = filter.isProfane( review.description ) ? "Rejected" : "Accepted";
  try {
    if ( review.status == "Accepted")
      book.addReview(bookId, review);
  } catch( err ){
    console.error(err);
    throw err;
  }
  return review.status;
}

async function readOneReview() {
    try {
      let data = await redis.recv(config.app.reviewsQueue, 0);
      return JSON.parse(data[1]);
    } catch (err) {
      console.error(err);
      throw err;
    }
}

async function readReviews() {
  while(true){
    try {
      let review = await readOneReview();
      if ( review ){
        handleReview(review);
        console.log(review);
      }
    } catch (err){
      console.log(review);
    }
  }
}

readReviews();
