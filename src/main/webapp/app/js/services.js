var commonServices = angular.module('SteamShop.commonServices',['ngCookies']);

commonServices.service('HttpConnectionService',['$http', '$rootScope', function($http, $rootScope){

    this.raiseGetHttpRequest = function(url, authToken, cb_success, cb_error)
    {
    	this.sendHttpRequestWithToken( 'GET', url, authToken, null, cb_success, cb_error );
    };
    
    this.raisePatchHttpRequest = function(url, authToken, cb_success, cb_error)
    {
    	this.sendHttpRequestWithToken( 'PATCH', url, authToken, null, cb_success, cb_error );
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

commonServices.service('GameFilters', ['$rootScope', function($rootScope){

    var that = this;
	  
      that.selectedGame = 570;
	  that.tags = {};
	  that.customSelect = {'Type': {selected: -1, list: [], show: false, val: ''},
			  		  'Hero': {selected: -1, list: [], show: false, val: ''},
			  		  'Class': {selected: -1, list: [], show: false, val: ''},
			  		  'ItemSet': {selected: -1, list: [], show: false, val: ''},
			  		  'Rarity': {selected: -1, list: [], show: false, val: ''},
			  		  'Quality': {selected: -1, list: [], show: false, val: ''},
			  		  'Exterior': {selected: -1, list: [], show: false, val: ''}
			  		}
	  
	  that.onFocus = function(list) {
		  
		  that.customSelect[list].val = '';
		  that.customSelect[list].show = true; 
		  that.customSelect[list].selected = -1
		  
		  for (var i = 0; i < $rootScope.tagsProps[that.selectedGame].filters.length; i++) {
			  if ($rootScope.tagsProps[that.selectedGame].filters[i].property == list) break;
		  }
		  
		  if (!$rootScope.tagsProps[that.selectedGame].filters[i].multiple) {
			  that.removeFilter(list); 
		  }
	  };
	  
	  that.onBlur = function(list) {
		  that.customSelect[list].show = false;
	  };	  
	  
	  that.onSelect = function(list, tag) {
		  that.customSelect.Type.show = false; 
		  
		  for (var i = 0; i < $rootScope.tagsProps[that.selectedGame].filters.length; i++) {
			  if ($rootScope.tagsProps[that.selectedGame].filters[i].property == list) break;
		  }
		  
		  if ($rootScope.tagsProps[that.selectedGame].filters[i].multiple) {
			  that.appendFilter(list, tag)
		  } else {			  
			  that.customSelect[list].val = $rootScope.tagsProps[that.selectedGame].tags[$rootScope.language][tag]; 
			  that.addFilter(list, tag) 			  
		  }
	  };
	  
	  that.navigateList = function(keyEvent, list) {
		  var activeElement = document.activeElement;
		  
	      if (keyEvent.which === 13) {
	    	  if (that.customSelect[list].selected > -1) {
	    		  for (var i = 0; i < $rootScope.tagsProps[that.selectedGame].filters.length; i++) {
	    			  if ($rootScope.tagsProps[that.selectedGame].filters[i].property == list) break;
	    		  }
	    		  
	    		  if ($rootScope.tagsProps[that.selectedGame].filters[i].multiple) {
		    		  that.customSelect[list].show = false;
		    		  that.appendFilter(list, that.customSelect[list].list[that.customSelect[list].selected]);
	    		  } else {
		    		  that.customSelect[list].val = $rootScope.tagsProps[that.selectedGame].tags[$rootScope.language][that.customSelect[list].list[that.customSelect[list].selected]]; 
		    		  that.customSelect[list].show = false;
		    		  that.addFilter(list, that.customSelect[list].list[that.customSelect[list].selected]);
	    		  }

	    		  if (activeElement) {
	    		      activeElement.blur();
	    		  }
	    	  }
	      } else if (keyEvent.which === 38) {
	    	  if (that.customSelect[list].selected > 0) {
	    		  that.customSelect[list].selected--;
		    	  var myElement = document.getElementById(list + '-' + that.customSelect[list].selected);
		    	  if (myElement.offsetTop - document.getElementById(list).scrollTop < 0)
		    		  document.getElementById(list).scrollTop = myElement.offsetTop;

	    	  }
	      } else if (keyEvent.which === 40) {
	    	  if (that.customSelect[list].selected < that.customSelect[list].list.length - 1) that.customSelect[list].selected++;
	    	  var myElement = document.getElementById(list + '-' + that.customSelect[list].selected);
	    	  if (myElement.offsetTop - document.getElementById(list).scrollTop > myElement.offsetHeight * 3)
	    		  document.getElementById(list).scrollTop = myElement.offsetTop - myElement.offsetHeight * 3;
	      }
	  }
	  
	  that.addFilter = function(tag, value) {
		  that.tags[tag] = [];
		  that.tags[tag].push(value);
	  };
	  
	  that.appendFilter = function(tag, value) {
		  if (that.tags[tag]) {
			  if (that.tags[tag].indexOf(value) == -1) that.tags[tag].push(value);
		  } else {
			  that.tags[tag] = [];
			  that.tags[tag].push(value);
		  }
	  };
	  
	  that.subtractFilter = function(tag, index) {
		  if (that.tags[tag] && index >= 0) {
			  that.tags[tag].splice(index, 1);
		  }
		  
		  if (that.tags[tag].length == 0) delete that.tags[tag];
	  };
	  
	  that.removeFilter = function(tag) {
		  delete that.tags[tag];
	  };
	  
	  that.clearFilters = function() {
		  that.tags = {};
		  that.customSelect = {'Type': {selected: -1, list: [], show: false, val: ''},
		  		  'Hero': {selected: -1, list: [], show: false, val: ''},
		  		  'Class': {selected: -1, list: [], show: false, val: ''},
		  		  'ItemSet': {selected: -1, list: [], show: false, val: ''},
		  		  'Rarity': {selected: -1, list: [], show: false, val: ''},
		  		  'Quality': {selected: -1, list: [], show: false, val: ''},
		  		  'Exterior': {selected: -1, list: [], show: false, val: ''}
		  		}
	  };
	  
	  that.filterByTags = function() {
	      return function(item) {
	    	  var match = true;
	    	  
	    	  for (var i = 0; i < item.description.tags.length; i++) {
	    		  if (that.tags[item.description.tags[i].category] && that.tags[item.description.tags[i].category].indexOf(item.description.tags[i].internal_name) == -1) {
	    			  match = false;
	    			  break;
	    		  }
	      	  }
	    	  
	          return match;
	      }
	  };
	  
	  that.typeAhead = function(query) {
	      return function(tag) {	    	  
	    	  if ($rootScope.tagsProps[that.selectedGame].tags[$rootScope.language][tag].indexOf(query) == -1) return false;	    	  
	    	  return true;
	      }	      
	  };
	  
	  that.alphabeticalSort = function(perform, tags) {
	      return function(tag) {
	    	  if (!perform) return tags.indexOf(tag);
	    	  
	    	  return $rootScope.tagsProps[that.selectedGame].tags[$rootScope.language][tag];
	      }
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
    
    this.humanTime = function(timestamp, withTime) {
		 var date = new Date(timestamp);
		 
		 if (!withTime)
		 	return date.getDate() + ' ' + MONTH[date.getMonth()] + ' ' + date.getFullYear();
		 
		 return date.getDate() + ' ' + MONTH[date.getMonth()] + ' ' + date.getFullYear() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    };
    
    this.raisePopup = function(title, body, buttons, args) {
    	$rootScope.popup = {
			title: title,
			body: body,
			buttons: buttons,
			args: args
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
    	var body = 'Неизвестная ошибка';
    	
		if (angular.fromJson(data)) {
			body = angular.fromJson(data).reason || angular.fromJson(data).error || 'Неизвестная ошибка';
		}
		 
		that.raisePopup(title, body);
    };
    
}]);

commonServices.factory('AuthService', [ 'HttpConnectionService', 'LocalStorageService', '$cookieStore', '$window',  function (HttpConnectionService, LocalStorageService, $cookieStore, $window) {
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
    		  LocalStorageService.removeCachedOffers();
          }, function() {
        	  $cookieStore.remove(TMP_AUTH_TOKEN);
        	  $cookieStore.remove(AUTH_TOKEN);
        	  isUserUpdating = false;
          });
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

commonServices.service('LocalStorageService', ['$localStorage', function($localStorage){
    
    this.getSelectedItemsHistory = function() {
    	return $localStorage[SELECTED_ITEMS_HISTORY];
    };
    
    this.updateSelectedItemsHistory = function(items) {
    	$localStorage[SELECTED_ITEMS_HISTORY] = items;
    };
    
    this.removeSelectedItemsHistory = function() {
    	delete $localStorage[SELECTED_ITEMS_HISTORY];
    };
    
    this.getCachedOffers = function() {
    	return $localStorage[CACHED_OFFERS];
    };
    
    this.updateCachedOffers = function(offers) {
    	$localStorage[CACHED_OFFERS] = offers;
    };
    
    this.removeCachedOffers = function() {
    	delete $localStorage[CACHED_OFFERS];
    };
    
    this.getCachedInventory = function() {
    	return $localStorage[CACHED_INVENTORY];
    };
    
    this.updateCachedInventory = function(items) {
    	$localStorage[CACHED_INVENTORY] = items;
    };
    
    this.removeCachedInventory = function() {
    	delete $localStorage[CACHED_INVENTORY];
    };
    
    this.getCachedFilters = function() {
    	return $localStorage[CACHED_FILTERS];
    };
    
    this.updateCachedFilters = function(filters) {
    	$localStorage[CACHED_FILTERS] = filters;
    };
    
    this.removeCachedFilters = function() {
    	delete $localStorage[CACHED_FILTERS];
    };
    
}]);

