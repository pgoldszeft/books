'use strict';

// Register `bookList` component, along with its associated controller and template
angular.
  module('bookList').
  component('bookList', {
    templateUrl: 'book-list/book-list.template.html',
    controller: ['Book', function BookListController(Book){
		let self = this;
		self.query = "";
		self.orderProp = 'name';
		Book.get().then( response =>{
			self.books = response;
		});
		self.addBook = () => {
			console.log("Add book");
			Book.set( {
				bookId: Date.now(),
				name: "Default book name",
				author: "Default author name",
				description: "Default description"
			})
			.then( bookList => {
				self.books = bookList;
			});
		};
	}]
  });
