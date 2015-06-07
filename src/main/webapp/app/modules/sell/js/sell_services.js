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
    
    this.getPendingTrades = function(cb_success, cb_error)
    {
       HttpConnectionService.raiseGetHttpRequest(CURRENT_USER_PENDING_SALES_WS_URL, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    this.isSelectedItemsHistoryEmpty = function()
    {
       return jQuery.isEmptyObject(AuthService.getSelectedItemsHistory());
    };
    
    this.cancelCurrentSale = function(cb_success, cb_error)
    {
       HttpConnectionService.raiseDeleteHttpRequest(OFFERS_REST_WS_URL, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    //TRADES
    this.setTradeLink = function(dataJson, cb_success, cb_error)
    {
       HttpConnectionService.raisePutHttpRequest(CURRENT_USER_TRADELINK_REST_WS_URL, AuthService.getAuthToken(), dataJson, cb_success, cb_error);
    };
    
    this.checkTradeStatus = function(tradeId, cb_success, cb_error)
    {
       var url = TRADES_REST_WS_URL + tradeId;
       HttpConnectionService.raiseGetHttpRequest(url, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    this.retryTrade = function(tradeId, cb_success, cb_error)
    {
       var url = TRADES_REST_WS_URL + tradeId;
       HttpConnectionService.raisePostHttpRequest(url, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    this.confirmTrade = function(tradeId, cb_success, cb_error)
    {
       var url = CHECK_TRADES_WS_URL + tradeId;
       HttpConnectionService.raisePostHttpRequest(url, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    this.deleteTrade = function(tradeId, cb_success, cb_error)
    {
       var url = TRADES_REST_WS_URL + tradeId;
       HttpConnectionService.raiseDeleteHttpRequest(url, AuthService.getAuthToken(), cb_success, cb_error);
    };
    
    
}]);
