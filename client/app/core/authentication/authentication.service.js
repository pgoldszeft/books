//
// Taken from http://jasonwatmore.com/post/2014/05/26/angularjs-basic-http-authentication-example
//

'use strict';

angular.module('core.authentication', []);
 
angular.module('core.authentication')
 
.factory('AuthenticationService',
    ['$http', '$cookies', '$rootScope', '$timeout', '$q',
    function ($http, $cookies, $rootScope, $timeout, $q) {
        var service = {};

        service.Login = function (username, password) {

			return $q( (resolve, reject) => {
				$http.post('/login/login', { user: username, password: password })
					.then( response => {
						resolve(response);
					}) 
					.catch( err => {
						reject(err);
					});
			});

        };
 
		service.isAuthenticated = () => {
			return $rootScope.globals && 
					$rootScope.globals.token && 
					$rootScope.globals.token !== null;
		}

		service.canEdit = () => {
			if ( ! $rootScope.globals )
				return false;

			let user = $rootScope.globals.user;
			if ( !user ){
				return false;
			}
			let foundItems = user.role.permissions.find( perm => perm == 'write' );
			return typeof foundItems != "undefined"
		}

        service.SetCredentials = function (user, token) {
            $rootScope.globals = {
				user: user,
				token: token
            };
 
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + token; // jshint ignore:line
            //$http.defaults.headers.common['Authorization'] = 'Basic ' + authData; // jshint ignore:line
            $cookies.put('globals', JSON.stringify($rootScope.globals));
        };
 
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Bearer ';
        };
	
		let g = $cookies.get('globals');
		$rootScope.globals = g && JSON.parse(g);
		if ( $rootScope.globals )
			service.SetCredentials( $rootScope.globals.user, $rootScope.globals.token);
 
        return service;
    }])
 
