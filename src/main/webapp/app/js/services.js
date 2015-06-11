var commonServices = angular.module('SteamShop.commonServices',['ngCookies']);

commonServices.service('HttpConnectionService',['$http', '$rootScope', function($http, $rootScope){

    this.raiseGetHttpRequest = function(url, authToken, cb_success, cb_error)
    {
    	this.sendHttpRequestWithToken( 'GET', url, authToken, null, cb_success, cb_error );
    };
    
    this.raiseDeleteHttpRequest = function(url, authToken, cb_success, cb_error)
    {
       this.sendHttpRequestWithToken( 'DELETE', url, authToken, null, cb_success, cb_error );
    };
    
    this.raisePostHttpRequest = function(url, authToken, dataObject, cb_success, cb_error)
    {
       this.sendHttpRequestWithToken( 'POST', url, authToken, dataObject, cb_success, cb_error );
    };
    
    this.raisePutHttpRequest = function(url, authToken, dataObject, cb_success, cb_error)
    {
       this.sendHttpRequestWithToken( 'PUT', url, authToken, dataObject, cb_success, cb_error );
    };
    
    this.sendHttpRequestWithToken = function(method, url, authToken, dataObject, cb_success, cb_error)
    {
    	var request =
    	{
    	   method: method,
   		   url: url,
   		   headers:{
   		      'X-AUTH-TOKEN': authToken,
   		   },
   		   data: dataObject,
   		}
    	
    	$http( request ).
        success(function ( data )
        {
           if (null != cb_success) cb_success(data);
        }).
        error(function ( data, status )
        {
      	 if (null != cb_error) cb_error( data );
        });
    };
    
}]);

commonServices.service('ApplicationUtils', ['$rootScope', function($rootScope){

    var that = this;
    
    this.imageURL = function(imageName, x, y)
    {
  	  if (imageName) {
		  x = x ? x : 0;
		  y = y ? y : 0;
		  var strSize = '';
		  if (x != 0 || y != 0)
			  strSize = '/' + x + 'x' + y;
		  return STEAM_COMMUNITY_URL + 'economy/image/' + this.v_trim(imageName) + strSize;
	  }
	  else
	  {
	     return STEAM_COMMUNITY_URL + 'public/images/trans.gif';
	  }
    };
    
    this.raisePopup = function(title, body, buttons) {
    	$rootScope.popup = {
			title: title,
			body: body, 			
			buttons: buttons
	    };
    };
    
    this.closePopup = function() {
    	$rootScope.popup = undefined;
    }
    
    this.setPath = function(path) {
    	if (path.constructor !== Array) {
    		path = [{text: path}]; 
    	}
    	$rootScope.path = path;
    }
    
    this.clearPath = function() {
    	$rootScope.path = [];
    }
    
    this.setStep = function(current, total) {
    	var totalArray = [];

    	for (var i = 1; i <= total; i++) {
    		totalArray.push(i);
    	}
    	
    	$rootScope.step = {current: current, total: totalArray};
    }
    
    this.clearStep = function() {
    	$rootScope.step = {};
    }
    
    this.v_trim = function(str)
    {
       if (str.trim)
       {
  		  return str.trim();
       }
  	   else
  	   {
  		  return str.replace(/^\s+/, '').replace(/\s+$/, '');
  	   }
    };
    
    this.addUrlAttrs = function(url, attr)
    {
    	for (var i=0 ; i < attr.length ; i++)
    	{
    	  if (i==0)
    	  {
    	     url = url + '?' + attr[i];
          }
    	  else
    	  {
    	     url = url + '&' + attr[i];
    	  }
    	}
    	return url;
    };
    
    this.cb_error_handler = function(data, status)
    {
    	$rootScope.isLoading = false;
    	
    	var title = 'Произошла ошибка';
		var body = angular.fromJson(data).reason;
		 
		that.raisePopup(title, body);
    };
    
}]);

commonServices.factory('AuthService', [ 'HttpConnectionService', '$cookieStore', '$window',  function (HttpConnectionService, $cookieStore, $window) {
    var currentUser = {};
    var isLoggedIn = false;
    var isUserUpdating = false;

    return {
    	
      login: function(cb_error) {
    	  HttpConnectionService.raiseGetHttpRequest(LOGIN_REST_WS_URL, '', function(data) {
          	  var loginResponse = angular.fromJson(data);
          	  $cookieStore.put(TMP_AUTH_TOKEN, loginResponse.token);
          	  $window.location.href = loginResponse.redirect_url;
          }, cb_error);
      },
      
      validateLogin: function(url, cb_success, cb_error) {
    	  HttpConnectionService.raisePostHttpRequest(url, this.getTempAuthToken(), null, cb_success, cb_error);
      },
      
      updateUserDetails: function() {
    	  isUserUpdating = true;
    	  HttpConnectionService.raiseGetHttpRequest(CURRENT_USER_PROFILE_REST_WS_URL, this.getAuthToken(), function(data) {
    		  currentUser = angular.fromJson(data);
    		  isLoggedIn = true;
    		  isUserUpdating = false;
          }, function() {
        	  $cookieStore.remove(TMP_AUTH_TOKEN);
        	  $cookieStore.remove(AUTH_TOKEN);
        	  isUserUpdating = false;
          });
      },
      
      getSelectedItemsHistory: function() {
    	  return $cookieStore.get(SELECTED_ITEMS_HISTORY);
      },
      
      updateSelectedItemsHistory: function(items) {
    	  $cookieStore.put(SELECTED_ITEMS_HISTORY, items);
      },
      
      removeSelectedItemsHistory: function() {
    	  $cookieStore.remove(SELECTED_ITEMS_HISTORY);
      },
      
      getCachedOffers: function() {
    	  return $cookieStore.get(CACHED_OFFERS);
      },
      
      updateCachedOffers: function(offers) {
    	  $cookieStore.put(CACHED_OFFERS, offers);
      },
      
      removeCachedOffers: function() {
    	  $cookieStore.remove(CACHED_OFFERS);
      },
      
      logout: function(cb_error) {
    	  isUserUpdating = true;
    	  HttpConnectionService.raiseDeleteHttpRequest(USERS_REST_WS_URL, this.getAuthToken(), function(data) {
    		  $cookieStore.remove(TMP_AUTH_TOKEN);
        	  $cookieStore.remove(AUTH_TOKEN);
    		  currentUser = {};
        	  isLoggedIn = false;
        	  isUserUpdating = false;
          }, cb_error);
      },
       
      isLoggedIn: function() { 
    	  return isLoggedIn;
      },
      
      isUserUpdating: function() {
    	  return isUserUpdating;
      },
      
      setLoggedIn: function(flag) { 
    	 isLoggedIn = flag;
      },
      
      getCurrentUser: function() {
    	  return currentUser;
      },
      
      setAuthToken: function(token) {
    	  $cookieStore.remove(TMP_AUTH_TOKEN);
    	  $cookieStore.put(AUTH_TOKEN, token);
      },
      
      clearAllTokens: function() {
    	  $cookieStore.remove(TMP_AUTH_TOKEN);
    	  $cookieStore.remove(AUTH_TOKEN);
      },
      
      getAuthToken: function() {
    	  return $cookieStore.get(AUTH_TOKEN);
      },
      
      getTempAuthToken: function() {
    	  return $cookieStore.get(TMP_AUTH_TOKEN);
      },
    };
}]);



