const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bookModel = require('../models/book');

/* GET books listing. */
router.get('/:bookId', function(req, res, next) {
  let query = req.params.bookId ? bookModel.findById(req.params.bookId) : bookModel.find();
  query
      .then( books => {
        res.json(books);
      })
      .catch( err => {
        res.send( err );
      });
});

/* GET user profile. */
router.post('/:bookId', function(req, res, next) {
  let enable = false;
  if ( !(req.isAuthenticated() &&
      req.user &&
      req.user.role &&
      req.user.role.permissions.find( p => p == 'write' ))
  ) {
    let error = new Error("Method not allowed.");
    error.status = 405;
    next (error);
  }
  else if ( req.params.bookId ){
    bookModel.findById(req.params.bookId)
      .then( book => {
          let newBook = req.body;
          for( let prop in newBook ){
              book[prop] = newBook[prop];
          }

          book.save( err => {
            if ( err ){
              let error = new Error("Bad request.  " + err);
              error.status = 400;
              next(error);
            }
            else{
              res.json(book);
            }
          })
      })
      .catch( err => {
        err.status = 404;
        next(err);
      })
  }
});

module.exports = router;
