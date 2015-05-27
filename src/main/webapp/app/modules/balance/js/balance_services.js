var balanceServices = angular.module('Balance.services', []);

balanceServices.service('BalanceService', ['HttpConnectionService', 'AuthService', 'ApplicationUtils',  function(HttpConnectionService, AuthService, ApplicationUtils){

	this.requestDeposit = function(dataJson, cb_success, cb_error)
    {
    	HttpConnectionService.raisePostHttpRequest(CASH_IN_REST_WS_URL, AuthService.getAuthToken(), dataJson, cb_success, cb_error);
    };
    
}]);
