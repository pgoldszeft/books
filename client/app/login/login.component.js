angular.
  module('login').
  component('login', {
    templateUrl: 'login/login.template.html',
    controller: ['AuthenticationService', '$scope', '$rootScope', '$location', function LoginController(AuthenticationService, $scope, $rootScope, $location) {
		let self = this;
        $scope.submit = () => {
		  $scope.dataLoading = true;
          AuthenticationService.Login( $scope.user, $scope.password )
            .then(response => {
              console.log("Logged in successfully.");
			  AuthenticationService.SetCredentials(
					response.data.user, 
					response.data.token);
              $location.path("/books");
            })
            .catch(err => {
			  $scope.error = err;
              console.error("Error logging in:  " + err.statusText);
            });
        }
      }
    ]
  });
