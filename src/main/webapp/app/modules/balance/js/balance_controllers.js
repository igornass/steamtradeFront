var balanceControllers = angular.module('Balance.controllers', []);

balanceControllers.controller('BalanceContentCtrl', ['$scope', '$rootScope', '$window', 'BalanceService', 'ApplicationUtils',
   function($scope, $rootScope, $window, BalanceService, ApplicationUtils)
   {
	  var ctrl = this;
	  
	  $scope.paymentMethods = [{name: 'Карта', value: 'AC'}, 
	                           {name: 'Яндекс.Деньги', value: 'PC'}];
	  
	  $scope.applicationUtils = ApplicationUtils;
	  $scope.applicationUtils.setPath('Баланс');
	  $scope.applicationUtils.setStep(0, 0);
	  $scope.paymentHistory = {};
	  
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
	  
	  $scope.initCashHistory = function() {
		  $rootScope.isLoading = true;
		  BalanceService.getCashHistory(ctrl.cb_cash_history_success, ApplicationUtils.cb_error_handler);
	  };

	  ctrl.cb_request_deposit_success = function(data) {
		  response = angular.fromJson(data);
		  $window.location.href = response.payment_link;
	  };
	  
	  ctrl.cb_cash_history_success = function(data) {
		  $rootScope.isLoading = false;
		  response = angular.fromJson(data);
		  console.log(response)
		  $scope.paymentHistory = response;
		  
		  for (i = 0; i < $scope.paymentHistory.length; i++) {
    		 $scope.paymentHistory[i].human_time = $scope.applicationUtils.humanTime($scope.paymentHistory[i].time);
    	  }
	  };
	  
	  
	  $scope.validateSum = function(sum) {
		  var regex  = /^\d+(?:\.{0,1}\d{0,2})$/;
		  return regex.test(sum)
	  }
	  
	  $scope.initCashHistory();
   },

]);