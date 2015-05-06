var balanceControllers = angular.module('Balance.controllers', []);

balanceControllers.controller('BalanceContentCtrl', ['$scope', '$rootScope',
   function($scope, $rootScope)
   {
	  var ctrl = this;
	  
	  $scope.selectMethod = function(methodId) {
		  $scope.selectedMethod = methodId;
	  }
   },

]);