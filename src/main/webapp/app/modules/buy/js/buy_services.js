var buyServices = angular.module('Buy.services', []);

buyServices.service('OffersService', ['HttpConnectionService', 'AuthService', 'ApplicationUtils',  function(HttpConnectionService, AuthService, ApplicationUtils){

	this.buyItem = function(itemId, cb_success, cb_error)
    {
       var url = BUY_REST_WS_URL + itemId;
       HttpConnectionService.raisePostHttpRequest(url, AuthService.getAuthToken(), null, cb_success, cb_error);
    };
	
	this.getItemDetails = function(gameId, classId, instanceId, cb_success, cb_error)
    {
       var url = ITEMS_REST_WS_URL + gameId + '/' + classId + '/' + instanceId;
       HttpConnectionService.raiseGetHttpRequest(url, '', cb_success, cb_error);
    };
    
    this.getOfferDetails = function(offerId, cb_success, cb_error)
    {
       var url = OFFERS_REST_WS_URL + offerId;
       HttpConnectionService.raiseGetHttpRequest(url, '', cb_success, cb_error);
    };
    
    this.getOffers = function(app_id, page_size, page, start_price, finish_price, market_hash_name,
    		sort_by, type_sort, tags, cb_success, cb_error)
    {
       var attr = [];
       if (!jQuery.isEmptyObject(app_id))
       {
         attr.push(URL_ATTR_OFFER_APP_ID + '=' + app_id);
       }
       if (!jQuery.isEmptyObject(page_size))
       {
         attr.push(URL_ATTR_OFFER_PAGE_SIZE + '=' + page_size);
       }
       if (!jQuery.isEmptyObject(page))
       {
         attr.push(URL_ATTR_OFFER_PAGE + '=' + page);
       }
       if (!jQuery.isEmptyObject(start_price))
       {
         attr.push(URL_ATTR_OFFER_START_PRICE + '=' + start_price);
       }
       if (!jQuery.isEmptyObject(finish_price))
       {
         attr.push(URL_ATTR_OFFER_FINISH_PRICE + '=' + finish_price);
       }
       if (!jQuery.isEmptyObject(market_hash_name))
       {
         attr.push(URL_ATTR_OFFER_MARKET_HASH_NAME + '=' + market_hash_name);
       }
       if (!jQuery.isEmptyObject(sort_by))
       {
         attr.push(URL_ATTR_OFFER_SORT_BY + '=' + sort_by);
       }
       if (!jQuery.isEmptyObject(type_sort))
       {
         attr.push(URL_ATTR_OFFER_TYPE_SORT + '=' + type_sort);
       }
       if (!jQuery.isEmptyObject(tags))
       {
          for (var i=0 ; i < tags.length ; i++)
          {
             attr.push(URL_ATTR_OFFER_TAGS + '=' + tags[i]);
          }
       }
       var url = ApplicationUtils.addUrlAttrs( OFFERS_REST_WS_URL, attr );
       HttpConnectionService.raiseGetHttpRequest(url, '', cb_success, cb_error);
    };
}]);
