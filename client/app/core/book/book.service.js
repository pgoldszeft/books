angular
	.module('core.book')
	.factory('Book', ['$http', '$q', '$rootScope', function($http, $q, $rootScope){
		let self = this;
		let backendUrl = 'http://localhost:3000';
		let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzRjNzM3OWVjNjVhZTBiMGM3ODJhOGUiLCJuYW1lIjoicGFibG8iLCJwYXNzd29yZCI6InBhYmxvIiwicm9sZSI6eyJwZXJtaXNzaW9ucyI6WyJyZWFkIiwid3JpdGUiLCJjcmVhdGUiLCJ1cGRhdGUiLCJkZWxldGUiXSwiX2lkIjoiNWM0Yzc1NDFlYzY1YWUwYjBjNzgyYThmIiwibmFtZSI6ImFkbWluIn0sImlhdCI6MTU0ODc4NTk1MCwiZXhwIjoxNTQ5MzkwNzUwfQ.h7Qh_7n4vbFS7WaWyOYcNWoB9NBlMuOvTAt7HdYCASA";
		let user = {};

		self.get = (id) => {
			let deferred = $q.defer();

			$http({
				url: backendUrl + '/book' + ( id ? '/' + id : ''),
				method: 'GET',
				params: { token: token }
			}).then( response => {
				let books = response.data;
				if ( Array.isArray(books) )
					books.forEach( book => book.bookId = book._id );
				else
					books.bookId = books._id;
				deferred.resolve( books );
			}, err => {
				deferred.reject('Failed getting the books: ' + err.message);
			});

			return deferred.promise;
		};

		return {
			get: function (id) {
				return self.get(id);
			},
			set: function (book) {
					let deferred = $q.defer();
					if ( !book ){
						deferred.reject( "Book service: set(): got null object as argument");
					} else {
						$http({
							url: backendUrl + "/book/" + book.bookId,
							method: 'POST',
							params: { token: token },
							data: book
						})
						.then( response => {
							let book = response.data;
							book.bookId = book._id;
							deferred.resolve( book );
						})
						.catch( err => {
							deferred.reject( err );
						});
					}
					return deferred.promise;
			},
			create: function (book) {
				let deferred = $q.defer();
				if ( !book ){
					deferred.reject( "Book service: set(): got null object as argument");
				} else {
					$http({
						url: backendUrl + "/book/create",
						method: 'POST',
						params: { token: token },
						data: book
					})
					.then( response => {
						deferred.resolve( response.data );
					})
					.catch( err => {
						deferred.reject( err );
					});
				}
				return deferred.promise;
			},
			delete: function( book ){
				let deferred = $q.defer();
				if ( !book )
					deferred.reject( "Book service: Error: trying to delete a null object.");
				else{
					let id = typeof book === 'object' ? book.bookId : book;
					$http({
						url: backendUrl + "/book/" + id.toString(),
						method: 'DELETE',
						params: { token: token }
					})
					.then( response => {
						self.get()
							.then( response => {
								deferred.resolve( response );
							})
							.catch( err => {
								deferred.reject(err);
							});
					})
					.catch( err => {
						deferred.reject(err);
					});
				}
				return deferred.promise;
			},
			addReview: function( bookId, review ){
				let deferred = $q.defer();
				$http({
					url: backendUrl + "/book/review/" + bookId.toString(),
					method: 'POST',
					data: review,
					params: { token: token }
				})
				.then( response => {
					deferred.resolve(response);
				})
				.catch( err => {
					deferred.reject(err);
				});
				return deferred.promise;
			},
			login: function( user, password ){
				let deferred = $q.defer();
				$http({
					url: backendUrl + "/login/login",
					method: 'POST',
					data: {
						user: user,
						password: password
					}
				})
				.then( response => {
					token = response.data.token;
					user = response.data.user;
					deferred.resolve(response);
				})
				.catch( err => {
					deferred.reject(err);
				});
				return deferred.promise;

			}
		}
	}]);
