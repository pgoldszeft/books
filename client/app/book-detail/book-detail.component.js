angular.
  module('bookDetail').
  component('bookDetail', {
    templateUrl: 'book-detail/book-detail.template.html',
    controller: ['Book', "$routeParams", function PhoneDetailController(Book, $routeParams) {
		let self = this;
        self.bookId = $routeParams.bookId;
		self.book = Book.get(self.bookId).then( book => { self.book = book } );
		self.update = () => {
			Book.set(self.book);
		}
      }
    ]
  });
