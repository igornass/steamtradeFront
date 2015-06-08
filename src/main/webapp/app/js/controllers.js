var commonControllers = angular.module('SteamShop.commonControllers', ['ui.router']);

//Main of Application Controller
commonControllers.controller('mainCtrl', ['$scope', '$rootScope', '$state', 'AuthService', 'ApplicationUtils', '$window',
function($scope, $rootScope, $state, AuthService, ApplicationUtils, $window) {
   var ctrl = this;
   $scope.applicationUtils = ApplicationUtils;
   
   $scope.$state = $state;
   $rootScope.popup = undefined;
   
   $scope.currentUser = {};
   $scope.isLoggedIn = false;
   $scope.isUserUpdating = false;
   
   $scope.menuMaximized = false;
   
   $scope.$watch( AuthService.isLoggedIn, function ( isLoggedIn ) {
	      $scope.currentUser = AuthService.getCurrentUser();
	      $scope.isLoggedIn = isLoggedIn;
   });
   
   $scope.$watch( AuthService.isUserUpdating, function ( isUserUpdating ) {
	      $scope.isUserUpdating = isUserUpdating;
   });
   
   $scope.loginHandler = function() {
	   $rootScope.isLoading = true;
	   AuthService.login(ApplicationUtils.cb_error_handler);
   };
   
   $scope.logoutHandler = function() {
	   AuthService.logout(ApplicationUtils.cb_error_handler);
   };
   
   $scope.toggleMenu = function() {
 	  $scope.menuMaximized = !$scope.menuMaximized;
   };
}]);
 

commonControllers.controller('ValidateLoginCtrl', ['$scope', '$rootScope', '$stateParams', 'AuthService', 'ApplicationUtils', '$state',
   function($scope, $rootScope, $stateParams, AuthService, ApplicationUtils, $state) {
     var ctrl = this;
     var params = $stateParams;
     
     ctrl.validateLogin = function() {
    	$rootScope.isLoading = true;
        var attr = [];
   	  	angular.forEach(params, function(value , key) {
            attr.push(key + '=' + encodeURIComponent(value));
        });
	    var url = ApplicationUtils.addUrlAttrs( VALID_OPENID_REST_WS_URL, attr );
	    AuthService.validateLogin(url, ctrl.cb_validate_login_success, ApplicationUtils.cb_error_handler);
     };
     
     ctrl.cb_validate_login_success = function(data) {
    	 var validateLoginResponse = angular.fromJson( data );
    	 AuthService.setAuthToken(validateLoginResponse.token);
    	 AuthService.updateUserDetails();
    	 $rootScope.isLoading = false;
   	     $state.go( STATE_BUY );
      };
      
      ctrl.validateLogin();
}]);





