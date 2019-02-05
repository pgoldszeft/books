
function BookService( AuthenticationService, $http, $q, $rootScope ) {
	let self = this;
//	let backendUrl = 'http://34.245.50.15:3000';
	let backendUrl = "";

	self.get = (id) => {
		let deferred = $q.defer();

		if ( !AuthenticationService.isAuthenticated() ){
			deferred.reject("Not authenticated");
			return deferred.promise;
		}

		$http({
			url: backendUrl + '/book' + ( id ? '/' + id : ''),
			method: 'GET'
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


	self.set = (book) => {
		let deferred = $q.defer();

		if ( !AuthenticationService.isAuthenticated() ){
			deferred.reject("Not authenticated");
			return deferred.promise;
		}

		if ( !book ){
			deferred.reject( "Book service: set(): got null object as argument");
		} else {
			$http({
				url: backendUrl + "/book/" + book.bookId,
				method: 'POST',
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
	}

	self.create = (book) =>{
		let deferred = $q.defer();

		if ( !AuthenticationService.isAuthenticated() ){
			deferred.reject("Not authenticated");
			return deferred.promise;
		}

		if ( !book ){
			deferred.reject( "Book service: set(): got null object as argument");
		} else {
			$http({
				url: backendUrl + "/book/create",
				method: 'POST',
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
	}

	self.delete = ( book ) => {
		let deferred = $q.defer();
		if ( !AuthenticationService.isAuthenticated() ){
			deferred.reject("Not authenticated");
			return deferred.promise;
		}
		if ( !book )
			deferred.reject( "Book service: Error: trying to delete a null object.");
		else{
			let id = typeof book === 'object' ? book.bookId : book;
			$http({
				url: backendUrl + "/book/" + id.toString(),
				method: 'DELETE'
			})
			.then( response => {
				deferred.resolve( response.data );
			})
			.catch( err => {
				deferred.reject(err);
			});
		}
		return deferred.promise;
	}

	self.addReview = ( bookId, review ) => {
		let deferred = $q.defer();
		if ( !AuthenticationService.isAuthenticated() ){
			deferred.reject("Not authenticated");
			return deferred.promise;
		}
		$http({
			url: backendUrl + "/book/review/" + bookId.toString(),
			method: 'POST',
			data: review
		})
		.then( response => {
			deferred.resolve(response);
		})
		.catch( err => {
			deferred.reject(err);
		});
		return deferred.promise;
	}
}

angular
	.module('core.book')
	.factory('Book', ['AuthenticationService', '$http', '$q', '$rootScope', function(AuthenticationService, $http, $q, $rootScope){
		let self = this;
		self.$rootScope = $rootScope;

		return new BookService(AuthenticationService, $http, $q, $rootScope);
	}]);
