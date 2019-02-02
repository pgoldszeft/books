angular.
  module('bookApp').
  config(['$routeProvider',
    function config($routeProvider) {
      $routeProvider
        .when('/login', {
          template: '<login><login>'
        })
        .when('/books', {
          template: '<book-list></book-list>'
        })
        .when('/books/:bookId', {
          template: '<book-detail></book-detail>'
        })
        .when('/review/:bookId', {
          template: '<review><review>'
        })
        .otherwise('/login');
    }
  ]);
