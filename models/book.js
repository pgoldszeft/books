const mongoose = require('mongoose');

function Book(){
  const self = this;

  let Schema = mongoose.Schema;
  let BookSchema = new Schema(
    {
      name: String,
      author: String,
      description: String,
      genreid: { type: Schema.Types.ObjectId, ref: 'genres'}
    }
  );

  return mongoose.model('books', BookSchema);
}

module.exports = Book();
