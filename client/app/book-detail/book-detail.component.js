angular.
  module('bookDetail').
  component('bookDetail', {
    templateUrl: 'book-detail/book-detail.template.html',
    controller: ['AuthenticationService', 'Book', "$routeParams", "$location", function PhoneDetailController(AuthenticationService, Book, $routeParams, $location) {
  		let self = this;
      self.bookId = $routeParams.bookId;
  		self.book = Book.get(self.bookId).then( book => { self.book = book } );
  		self.update = () => {
  			Book.set(self.book);
  		}
      self.addReview = () => {
        $location.path('/review/' + self.bookId);
      }

      self.back = () => {
        $location.path('/books');
      }
		self.canEdit = () =>{
			return AuthenticationService.canEdit();
		};
    }]
  });
