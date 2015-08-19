var balanceServices = angular.module('Support.services', []);

balanceServices.service('SupportService', ['HttpConnectionService', 'AuthService',  function(HttpConnectionService, AuthService){

	this.getCurrentUserTickets = function(cb_success, cb_error)
    {
		HttpConnectionService.raiseGetHttpRequest(TICKETS_REST_WS_URL, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    this.getTicketSubjects = function(cb_success, cb_error)
    {
    	HttpConnectionService.raiseGetHttpRequest(TICKET_SUBJECTS_REST_WS_URL, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    this.postNewTicket = function(dataJson, cb_success, cb_error)
    {
    	HttpConnectionService.raisePostHttpRequest(TICKETS_REST_WS_URL, AuthService.getAuthToken(), dataJson, cb_success, cb_error);
    };
    
    this.addMessageToTicket = function(ticketId, dataJson, cb_success, cb_error)
    {
    	var URL = TICKETS_REST_WS_URL + ticketId;
    	HttpConnectionService.raisePostHttpRequest(URL, AuthService.getAuthToken(), dataJson, cb_success, cb_error);
    };
    
    this.closeTicket = function(ticketId, cb_success, cb_error)
    {
    	var URL = TICKETS_REST_WS_URL + ticketId;
    	HttpConnectionService.raiseDeleteHttpRequest(URL, AuthService.getAuthToken(), cb_success, cb_error);
    };
}]);
