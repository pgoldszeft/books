angular.
  module('header').
  component('header', {
    templateUrl: 'header/header.template.html',
    controller: ['AuthenticationService', '$scope', '$rootScope', '$location', function HeaderController(AuthenticationService, $scope, $rootScope, $location) {
		let self = this;
        $scope.logout = () => {
			AuthenticationService.ClearCredentials();
			$location.path('/login');
        }
      }
    ]
  });
