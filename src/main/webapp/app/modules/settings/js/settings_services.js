var settingsServices = angular.module('Settings.services', []);

settingsServices.service('SettingsService', ['HttpConnectionService', 'AuthService', 'ApplicationUtils',  function(HttpConnectionService, AuthService, ApplicationUtils){

	this.getUserDetails = function(cb_success, cb_error)
    {
       HttpConnectionService.raiseGetHttpRequest(CURRENT_USER_PROFILE_REST_WS_URL, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    this.setTradeLink = function(dataJson, cb_success, cb_error)
    {
       HttpConnectionService.raisePutHttpRequest(CURRENT_USER_TRADELINK_REST_WS_URL, AuthService.getAuthToken(), dataJson, cb_success, cb_error);
    };
    
    this.setPhone = function(dataJson, cb_success, cb_error)
    {
       HttpConnectionService.raisePutHttpRequest(CURRENT_USER_TRADING_REST_WS_URL, AuthService.getAuthToken(), dataJson, cb_success, cb_error);
    };
    
    this.sendCode = function(operationId, dataJson, cb_success, cb_error)
    {
    	var url = OPERATIONS_REST_WS_URL + operationId;
    	HttpConnectionService.raisePostHttpRequest(url, AuthService.getAuthToken(), dataJson, cb_success, cb_error);
    };
    
    this.getOperations = function(cb_success, cb_error)
    {
    	HttpConnectionService.raiseGetHttpRequest(OPERATIONS_REST_WS_URL, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    this.resendCode = function(operationId, cb_success, cb_error)
    {
    	var url = OPERATIONS_REST_WS_URL + operationId + OPERATIONS_RESEND_REST_WS_URL;
    	HttpConnectionService.raisePostHttpRequest(url, AuthService.getAuthToken(), null, cb_success, cb_error);
    };
        
    this.cancelOperation = function(operationId, cb_success, cb_error)
    {
    	var url = OPERATIONS_REST_WS_URL + operationId;
    	HttpConnectionService.raiseDeleteHttpRequest(url, AuthService.getAuthToken(), cb_success, cb_error);
    }
    
}]);
