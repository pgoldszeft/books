'use strict';

// Register `bookList` component, along with its associated controller and template
angular.
  module('bookList').
  component('bookList', {
    templateUrl: 'book-list/book-list.template.html',
    controller: ['$location', 'Book', function BookListController($location, Book){
  		let self = this;
  		self.query = "";
  		self.orderProp = 'name';

      self.setBooksList = (booksList) =>{
        self.books = booksList;
      }

  		Book.get().then( response =>{
  			self.setBooksList( response );
  		});
  		self.addBook = () => {
  			console.log("Add book");
  			Book.create( {
  				bookId: Date.now(),
  				name: "Default book name",
  				author: "Default author name",
  				description: "Default description",
          imageUrl: "http://i.imgur.com/sJ3CT4V.gif"
  			})
  			.then( bookList => {
  				//self.books = bookList;
          let id = Array.isArray(bookList) ? bookList[0] : bookList;
          $location.path('/books/' + id);
  			});
  		};

      self.deleteBook = (id) => {
        Book.delete( id )
          .then( () => {
            Book.get().then( response => {
              self.setBooksList( response );
            })
            .catch( err => {
              console.log("Failed reading the list of books: " + err );
            });
          })
          .catch( err => {
            console.log("Failed deleting a book: " + err );
          });
      };

  	}]
  });
