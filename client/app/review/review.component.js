angular.
  module('review').
  component('review', {
    templateUrl: 'review/review.template.html',
    controller: ['Book', "$routeParams", "$location", function ReviewController(Book, $routeParams, $location) {
    		let self = this;
        self.bookId = $routeParams.bookId;
        self.user = $routeParams.user;
        self.review = "Write your review here.";
        self.rating = 100;

        self.submit = () => {
          Book.addReview(self.bookId, {
            description: self.review,
            review: self.review
          });
          $location.path("/books/" + self.bookId);
        };

        self.cancel = () => {
          $location.path("/books/" + self.bookId);
        }
      }
    ]
  });
