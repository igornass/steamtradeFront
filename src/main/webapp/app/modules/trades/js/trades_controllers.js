var tradesControllers = angular.module('Trades.controllers', []);

tradesControllers.controller('TradesContentCtrl', ['$scope', '$rootScope', '$window', 'TradesService', 'ApplicationUtils',
   function($scope, $rootScope, $window, TradesService, ApplicationUtils)
   {
	 var ctrl = this;
	 $scope.trades = [];
	 
	 $scope.confirmTrade = function(tradeId) {
		 $rootScope.isLoading = true;
		 
		 TradesService.confirmTrade(tradeId, ctrl.cb_confirm_trade_success, ApplicationUtils.cb_error_handler);
	 };
	 
	 $scope.retryTrade = function(tradeId) {
		 $rootScope.isLoading = true;
		 
		 TradesService.retryTrade(tradeId, ctrl.cb_retry_trade_success, ApplicationUtils.cb_error_handler);
	 };
	 
	 $scope.initTrades = function(completedTrades) {
		 $scope.completedTrades = completedTrades;
		 $scope.trades = [];
		 $rootScope.isLoading = true;
		 
		 if (completedTrades)
		 {
	        TradesService.getCompletedTrades(ctrl.cb_init_trades_success, ApplicationUtils.cb_error_handler);
	     }
		 else
		 {
            TradesService.getIncompletedTrades(ctrl.cb_init_trades_success, ApplicationUtils.cb_error_handler); 
		 }
     };
     
     ctrl.cb_confirm_trade_success = function(data) {
    	 $rootScope.isLoading = false;
    	 
    	 ApplicationUtils.raisePopup('Подтверждение обмена', 'Обмен успешно подтвержден.');
     };
     
     ctrl.cb_retry_trade_success = function(data) {
    	 $rootScope.isLoading = false;
    	 
    	 ApplicationUtils.raisePopup('Повтор обмена', 'Обмен успешно повторён.');
     };
     
     ctrl.cb_init_trades_success = function(data) {
		 $rootScope.isLoading = false;
    	 $scope.trades = angular.fromJson(data);
    	 
    	 for (i = 0; i < $scope.trades.length; i++) {
    		 var date = new Date($scope.trades[i].creating_time);
    		 $scope.trades[i].human_time = date.getDate() + ' ' + MONTH[date.getMonth()] + ' ' + date.getFullYear();
    	 }
    	 
    	 console.log($scope.trades);
     };
     
     $scope.initTrades(false);
	 

   }
]);