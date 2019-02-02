angular.
  module('login').
  component('login', {
    templateUrl: 'login/login.template.html',
    controller: ['Book', '$scope', '$location', function LoginController(Book, $scope, $location) {
    		let self = this;
        self.user = "Username";
        self.password = "Password";
        $scope.submit = () => {
          Book.login( self.user, self.password )
            .then(response => {
              console.log("Logged in successfully.");
              $location.path("/books");
            })
            .catch(err => {
              console.error("Error logging in.  " + err);
            });
        }
      }
    ]
  });
