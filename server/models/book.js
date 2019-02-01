const mongoose = require('mongoose');
const redis = require("../services/redis");
const config = require("../config/config");

function Book(){
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

  self.mongoReviewModel = mongoose.model('review', bookReviewSchema);

  let BookSchema = new Schema(
    {
      name: String,
      author: String,
      description: String,
      imageUrl: String,
      genreid: { type: Schema.Types.ObjectId, ref: 'genres'},
      reviews: [bookReviewSchema]
    }
  );

  self.mongoModel =  mongoose.model('books', BookSchema);

  self.find = (arg) => {
    return self.mongoModel.find(arg)
            .populate('genres')
            .exec();
  }

  self.findById = (id) => {
    return self.mongoModel.findById(id)
            .populate('genres')
            .exec();
  }

  self.create = (args) => {
    return new Promise( (resolve, reject) => {
      self.mongoModel.create( args )
              .then( newBooks => {
                if ( Array.isArray(newBooks) )
                  resolve( newBooks.map( book => book._id ) );
                else
                  resolve( [ newBooks.id ] );
              })
              .catch( err => {
                reject( err );
              });
    })
  }

  self.delete = (id) => {
    return self.mongoModel.findByIdAndDelete(id);
  }

  self.update = (id, newBookInfo) => {
    return new Promise( (resolve, reject ) =>{
      self.mongoModel.findById(id)
          .then( book => {
            for( let prop in newBookInfo )
              book[prop] = newBookInfo[prop];
            book.save( err => {
              if (err){
                err.status = 400;
                reject(err);
              } else {
                resolve(book);
              }
            })
          })
          .catch( err => {
            err.status = 404;
            reject(err);
          })

    });
  }

  self.addReview = (id, review) => {
    return new Promise( (resolve, reject) => {
      self.findById(id)
        .then( book => {
          let reviewObj = new self.mongoReviewModel(review);
          book.reviews.push(reviewObj);
          book.save( err => {
            if (err) {
              err.status = 400;
              reject(err);
            } else {
              resolve(book);
            }
          });
        })
        .catch( err => {
          err.status = 404;
          reject("Couldn't find book #" + id + " " + err);
        })
    })
  }

  self.queueReview = (id, review) => {
      review.status = "Submitted";
      review.book = id;
      return redis.send( config.app.reviewsQueue, JSON.stringify(review) );
  }
}


module.exports = new Book();
