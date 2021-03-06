var tradesControllers = angular.module('Trades.controllers', []);

tradesControllers.controller('TradesContentCtrl', ['$scope', '$rootScope', '$window', 'TradesService', 'ApplicationUtils',
   function($scope, $rootScope, $window, TradesService, ApplicationUtils)
   {
	 var ctrl = this;
	 $scope.applicationUtils = ApplicationUtils;
	 $scope.applicationUtils.setPath('Обмены');
	 $scope.applicationUtils.setStep(0, 0);
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
		 $scope.applicationUtils.closePopup();
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
    	 
    	 title = 'Подтверждение обмена';
    	 body = 'Обмен успешно подтвержден.';
    	 
    	 buttons = [
    	            { text: 'ОК', func: $scope.initTrades}
    	            ];
    	 
    	 args = false;
    	 
    	 $scope.applicationUtils.raisePopup(title, body, buttons, args);
     };
     
     ctrl.cb_retry_trade_success = function(data) {
    	 $rootScope.isLoading = false;
    	 
    	 title = 'Повтор обмена';
    	 body = 'Обмен успешно повторён.';
    	 
    	 buttons = [
    	            { text: 'ОК', func: $scope.initTrades}
    	            ];
    	 
    	 args = true;
    	 
    	 $scope.applicationUtils.raisePopup(title, body, buttons, args);
     };
     
     ctrl.cb_init_trades_success = function(data) {
		 $rootScope.isLoading = false;
    	 $scope.trades = angular.fromJson(data);
    	 
    	 for (i = 0; i < $scope.trades.length; i++) {
    		 $scope.trades[i].human_time = $scope.applicationUtils.humanTime($scope.trades[i].creating_time);
    	 }
    	 
    	 console.log($scope.trades);
     };
     
     $scope.initTrades(false);
	 

   }
]);