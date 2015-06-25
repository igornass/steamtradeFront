var buyServices = angular.module('Exchange.services', []);

buyServices.service('TradesService', ['HttpConnectionService', 'AuthService', 'ApplicationUtils', function(HttpConnectionService, AuthService, ApplicationUtils){

	this.getIncompletedTrades = function(cb_success, cb_error)
    {
       HttpConnectionService.raiseGetHttpRequest(INCOMPLETED_TRADES_WS_URL, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    this.getCompletedTrades = function(cb_success, cb_error)
    {
    	HttpConnectionService.raiseGetHttpRequest(COMPLETED_TRADES_WS_URL, AuthService.getAuthToken(), cb_success, cb_error);
    };

}]);
