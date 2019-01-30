//const userModel = require('user');
const mongoose = require('mongoose');

function BookReview( ){
  const self = this;

  let bookReviewSchema = new mongoose.Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'users'},
      rating: Number,
      status: String,
      description: String
    }
  );

  self.mongoModel = mongoose.model('roles', bookReviewSchema);
}

module.exports = new BookReview();
