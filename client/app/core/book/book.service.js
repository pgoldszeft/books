angular
	.module('core.book')
	.factory('Book', ['$http', '$q', function($http, $q){
		let self = this;
		return {
			get: function (id) {
				let deferred = $q.defer();
				if ( !self.books ){
					$http.get('books/books.json').then( response => {
						self.books = response.data;
						let ret = id ? self.books.find(book => book.bookId == id) : self.books;
						deferred.resolve( ret );
					}, err => {
						deferred.reject('Failed getting the books: ' + err.message);	
					});
				} else {
					deferred.resolve( id ? self.books.find(book => book.bookId == id) : self.books );
				}
				return deferred.promise;
			},
			set: function (book) {
					let deferred = $q.defer();
					this.get()
						.then( booksList => {
							self.books = booksList
								.filter( b => b.bookId != book.bookId )
							self.books.push( book );
							deferred.resolve( self.books );
						})
						.catch( err => {
							deferred.reject( err );
						});
					return deferred.promise;
			}
		}
	}]);
