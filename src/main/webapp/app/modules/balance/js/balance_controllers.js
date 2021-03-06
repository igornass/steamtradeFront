var balanceControllers = angular.module('Balance.controllers', []);

balanceControllers.controller('BalanceContentCtrl', ['$scope', '$rootScope', '$window', 'BalanceService', 'ApplicationUtils', '$stateParams', '$state', 
   function($scope, $rootScope, $window, BalanceService, ApplicationUtils, $stateParams, $state )
   {
	  var ctrl = this;
	  
	  $scope.depositMethods = [];
	  $scope.withdrawMethods = [];
	  
	  
	  $scope.applicationUtils = ApplicationUtils;
	  $scope.applicationUtils.setPath('Баланс');
	  $scope.applicationUtils.setStep(0, 0);
	  $scope.paymentHistory = {};
	  
	   $scope.initPaymentsMethods = function() {
		   $.getJSON("resources/json/payments_deposit.json", function(data) {
			   $scope.depositMethods = data;
		   });

		   $.getJSON("resources/json/payments_withdraw.json", function(data) {
			   $scope.withdrawMethods = data;
		   });
	   };
	  
	  $scope.selectMethod = function(methodId) {
		  $scope.selectedMethod = methodId;
	  };
	  
	  $scope.depositBtn = function() {
		  $scope.depositSum = $scope.depositSum.replace(/,/g, '.')
		  
		  if ($scope.validateSum($scope.depositSum) && $scope.deposit) {
			  $rootScope.isLoading = true;
			  json = {'sum' : parseInt(+$scope.depositSum*100), 'gateway' : $scope.deposit};
			  BalanceService.requestDeposit(json, ctrl.cb_request_deposit_success, ApplicationUtils.cb_error_handler);
		  } else {
			  alert ('Invalid sum or gateway value');
		  };
	  };
	  
	  $scope.withdrawBtn = function() {
		  $scope.withdrawSum = $scope.withdrawSum.replace(/,/g, '.')
		  
		  if ($scope.validateSum($scope.withdrawSum) && $scope.withdraw) {
			  $rootScope.isLoading = true;
			  json = {'sum' : parseInt(+$scope.withdrawSum*100), 'gateway' : $scope.withdraw, 'params' : $scope.withdrawTarget};
			  BalanceService.requestWithdraw(json, ctrl.cb_request_withdraw_success, ApplicationUtils.cb_error_handler);
		  } else {
			  alert ('Invalid sum, params or gateway value');
		  };
	  };
	  
	  $scope.initCashHistory = function() {
		  $rootScope.isLoading = true;
		  BalanceService.getCashHistory(ctrl.cb_cash_history_success, ApplicationUtils.cb_error_handler);
	  };
	  
	  ctrl.cb_request_withdraw_success = function(data) {
		  $rootScope.isLoading = false;
		  console.log(data);
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
	  
	  if ($stateParams.state)
	  {
			 title = 'Статус операции';
			 body = 'На ваш баланс успешно зачислено ' + $stateParams.sum + 'руб.';
			 buttons = [{ text: 'Оk', func: function() {
				  $scope.applicationUtils.closePopup();
				  $state.go( STATE_BALANCE );
			  }}];
			 if ($stateParams.state == "fail")
			 {
			   body = 'Произошла ошибка при списании средств.';
			 }
			  
			 $scope.applicationUtils.raisePopup(title, body, buttons);
	  }
	  else
	  {
	     $scope.initCashHistory();
	     $scope.initPaymentsMethods();
	  }
   },

]);