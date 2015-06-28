var tradesControllers = angular.module('Trades.controllers', []);

tradesControllers.controller('TradesContentCtrl', ['$scope', '$rootScope', '$window', 'TradesService', 'ApplicationUtils',
   function($scope, $rootScope, $window, TradesService, ApplicationUtils)
   {
	 var ctrl = this;
	 $scope.trades = [];
	 
	 $scope.initTrades = function(completedTrades) {
		 if (completedTrades)
		 {
	        TradesService.getCompletedTrades(ctrl.cb_init_trades_success, ApplicationUtils.cb_error_handler);
	     }
		 else
		 {
            TradesService.getIncompletedTrades(ctrl.cb_init_trades_success, ApplicationUtils.cb_error_handler); 
		 }
     };
     
     ctrl.cb_init_trades_success = function(data) {
    	 response = angular.fromJson(data);
     };
     
     $scope.initTrades(false);
	 

   }
]);