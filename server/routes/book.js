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

function IsAllowedMiddleware( req, res, next ){
  if ( !IsAllowedToWrite(req)) {
    let error = new Error("Method not allowed.");
    error.status = 401;
    res.status(401).send(error);
  } 
  else
	next();
}

/* GET books listing. */
router.get('/', function(req, res, next) {
  bookModel.find()
      .then( books => {
		if ( !books )
			books = [];
        res.status(200).json(books);
      })
      .catch( err => {
        res.send( err );
      });
});

/* GET books listing or a single book by ID. */
router.get('/:bookId', function(req, res, next) {
  let query = req.params.bookId ? bookModel.findById(req.params.bookId) : bookModel.find();
  query
      .then( books => {
		if ( !books )
			books = [];
        res.status(200).json(books);
      })
      .catch( err => {
        res.status(500).send(err);
      });
});

// POST books creation.
// @body - array of books to create
// @return - array of IDs of the created book.
router.post('/create', IsAllowedMiddleware, function(req, res, next){
  if ( req.body ){
    bookModel.create( req.body )
      .then( books => {
        res.status(200).json(books);
      } )
      .catch( err => {
        next(err); }
      );
  }
});

/* POST book update. */
router.post('/:bookId', IsAllowedMiddleware, function(req, res, next){
  if ( req.params.bookId && req.body ){
    bookModel.update( req.params.bookId, req.body )
      .then( books => {
        res.status(200).json(books);
      })
      .catch( err => {
        next(err); }
      );
  } 
  else 
	res.status(400).send("Unspecified bookId or no body");
});

router.delete('/:bookId', IsAllowedMiddleware, function(req, res, next) {
  if ( req.params.bookId ){
    bookModel.delete( req.params.bookId )
      .then( book => {
        res.status(200).json( book.id );
       } )
      .catch( err => {
        next(err);
      });
  }
  else
	res.status(400).send("bookId not specified.");
});

router.post("/review/:bookId", IsAllowedMiddleware, function(req, res, next) {
  if ( req.params.bookId && req.body ){
    req.body.user = req.user.name;
    bookModel.queueReview( req.params.bookId, req.body )
      .then( book => {
        res.status(200).json( book );
       })
      .catch( err => {
        next(err);
      });
  }
  else 
	res.status(400).send("Unspecified bookId or no body");
});

module.exports = router;
