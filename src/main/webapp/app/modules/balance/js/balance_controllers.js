var balanceControllers = angular.module('Balance.controllers', []);

balanceControllers.controller('BalanceContentCtrl', ['$scope', '$rootScope', '$window', 'BalanceService', 'ApplicationUtils',
   function($scope, $rootScope, $window, BalanceService, ApplicationUtils)
   {
	  var ctrl = this;
	  
	  $scope.selectMethod = function(methodId) {
		  $scope.selectedMethod = methodId;
	  };
	  
	  $scope.deposit = function() {
		  $scope.depositSum = $scope.depositSum.replace(/,/g, '.')
		  
		  if ($scope.validateSum($scope.depositSum) && $scope.gateway) {
			  $rootScope.isLoading = true;
			  json = {'sum' : parseInt(+$scope.depositSum*100), 'gateway' : $scope.gateway};
			  BalanceService.requestDeposit(json, ctrl.cb_request_deposit_success, ApplicationUtils.cb_error_handler);
		  } else {
			  alert ('Invalid sum or gateway value');
		  };
	  };

	  ctrl.cb_request_deposit_success = function(data) {
		  response = angular.fromJson(data);
		  $window.location.href = response.payment_link;
	  };
	  
	  $scope.validateSum = function(sum) {
		  var regex  = /^\d+(?:\.{0,1}\d{0,2})$/;
		  return regex.test(sum)
	  }
   },

]);