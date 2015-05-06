var sellServices = angular.module('Sell.services', []);

sellServices.service('InventoryService', ['HttpConnectionService', 'AuthService',  function(HttpConnectionService, AuthService){

    this.getUserInventory = function(gameId, cb_success, cb_error)
    {
       var url = CURRENT_USER_INVENTORY_REST_WS_URL + gameId;
       HttpConnectionService.raiseGetHttpRequest(url, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    this.sellSelectedItems = function(selectedItemsJson, cb_success, cb_error)
    {
       HttpConnectionService.raisePostHttpRequest(OFFERS_REST_WS_URL, AuthService.getAuthToken(), selectedItemsJson, cb_success, cb_error);
    };
    
    this.getPendingSales = function(cb_success, cb_error)
    {
       HttpConnectionService.raiseGetHttpRequest(CURRENT_USER_PENDING_SALES_WS_URL, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    this.cancelCurrentSale = function(cb_success, cb_error)
    {
       HttpConnectionService.raiseDeleteHttpRequest(OFFERS_REST_WS_URL, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    
}]);
