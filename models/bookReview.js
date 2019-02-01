//const userModel = require('user');
const mongoose = require('mongoose');

function BookReview( ){
  const self = this;
  let Schema = mongoose.Schema;
  let bookReviewSchema = new mongoose.Schema(
    {
      user: String,
      rating: Number,
      status: String,
      description: String
    }
  );

  self.mongoModel = mongoose.model('roles', bookReviewSchema);
}

module.exports = new BookReview();
