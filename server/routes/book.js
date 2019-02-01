const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bookModel = require('../models/book');

function IsAllowedToWrite( req ){
  return ( req.isAuthenticated() &&
      req.user &&
      req.user.role &&
      req.user.role.permissions.find( p => p == 'write' ));
}

/* GET books listing or a single book by ID. */
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

// POST books creation.
// @body - array of books to create
// @return - array of IDs of the created book.
router.post('/create', function(req, res, next){
  if ( !IsAllowedToWrite(req)) {
    let error = new Error("Method not allowed.");
    error.status = 405;
    next (error);
  }
  else if ( req.body ){
    bookModel.create( req.body )
      .then( books => {
        res.json(books);
      } )
      .catch( err => {
        next(err); }
      );
  }
});

/* POST book update. */
router.delete('/:bookId', function(req, res, next) {
  if ( !IsAllowedToWrite(req)) {
    let error = new Error("Method not allowed.");
    error.status = 405;
    next (error);
  }
  else if ( req.params.bookId ){
    bookModel.delete( req.params.bookId )
      .then( book => {
        res.json( book._id );
       } )
      .catch( err => {
        next(err);
      } );
  }
});

router.post("/review/:bookId", function(req, res, next) {
  if ( !(req.isAuthenticated() && req.user) ){
    let error = new Error("Method not allowed.");
    error.status = 405;
    next (error);
  }

  if ( req.params.bookId && req.body ){
    req.body.user = req.user.name;
    bookModel.queueReview( req.params.bookId, req.body )
      .then( book => {
        res.json( book );
       })
      .catch( err => {
        next(err);
      });
  }
});

module.exports = router;
