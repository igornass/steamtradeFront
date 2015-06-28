var tradesServices = angular.module('Trades.services', []);

tradesServices.service('TradesService', ['HttpConnectionService', 'AuthService', function(HttpConnectionService, AuthService){

	this.getIncompletedTrades = function(cb_success, cb_error)
    {
       HttpConnectionService.raiseGetHttpRequest(INCOMPLETED_TRADES_WS_URL, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    this.getCompletedTrades = function(cb_success, cb_error)
    {
    	HttpConnectionService.raiseGetHttpRequest(COMPLETED_TRADES_WS_URL, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    this.confirmTrade = function(tradeId, cb_success, cb_error)
    {
       var url = CONFIRM_TRADE_WS_URL + tradeId;
       HttpConnectionService.raisePostHttpRequest(url, AuthService.getAuthToken(), null, cb_success, cb_error);
    };
    
    this.retryTrade = function(tradeId, cb_success, cb_error)
    {
       var url = TRADES_REST_WS_URL + tradeId;
       HttpConnectionService.raisePostHttpRequest(url, AuthService.getAuthToken(), null, cb_success, cb_error);
    };
    
}]);
