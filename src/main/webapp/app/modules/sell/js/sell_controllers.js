var sellControllers = angular.module('Sell.controllers', []);

sellControllers.controller('SellContentCtrl', ['$scope', '$rootScope', '$timeout', '$window', '$interval', 'InventoryService', 'SettingsService', 'ApplicationUtils', 'GameFilters', 'AuthService',
   function($scope, $rootScope, $timeout, $window, $interval, InventoryService, SettingsService, ApplicationUtils, GameFilters, AuthService)
   {
	  var ctrl = this;
	  
	  $scope.doubleClickFlag = true;
	  $scope.user = {};
	  
	  $scope.inventory = [];
	  $scope.selectedItems = [];
	  $scope.currentTrade = null;
	  $scope.applicationUtils = ApplicationUtils;
	  $scope.applicationUtils.setPath('Продать');
	  $scope.applicationUtils.setStep(0, 0);
	  $scope.activeSell = false;
	  $scope.secondStep = false;
	  $scope.counter = 0;
	  $scope.gameFilters = GameFilters;	
	  $scope.gameFilters.clearFilters();  
	  
	   
	  $scope.$watch( AuthService.isLoggedIn, function () {
	      $scope.user = AuthService.getCurrentUser();
	  });
	  
	  $scope.adjustGrid = function() {
		  	if ($window.innerWidth <= 400)
	    		$scope.columns = 1;
	    	else if ((($window.innerWidth > 400) && ($window.innerWidth <= 650)) ||
	    			(($window.innerWidth > 720) && ($window.innerWidth <= 850)) ||
	    			(($window.innerWidth > 940) && ($window.innerWidth <= 1050)) ||
	    			(($window.innerWidth > 1150) && ($window.innerWidth <= 1250)))
	    		$scope.columns = 2;
	    	else if ((($window.innerWidth > 650) && ($window.innerWidth <= 720)) ||
	    			(($window.innerWidth > 850) && ($window.innerWidth <= 940)) ||
	    			(($window.innerWidth > 1050) && ($window.innerWidth <= 1150)) ||
	    			(($window.innerWidth > 1250) && ($window.innerWidth <= 1580)))
	    		$scope.columns = 3;
	    	else
	    		$scope.columns = 4;
	  };
	  
	  angular.element($window).bind('resize', function() {
		    $scope.$apply(function() {
		    	$scope.adjustGrid();
		    });
		});
	  
	  $scope.selectGame = function(gameId) {
 		 $scope.gameFilters.selectedGame = gameId;
		 $scope.gameFilters.clearFilters();
    	 var cachedInventory = InventoryService.getCachedInventory(); 

    	 if (cachedInventory && cachedInventory[0] && cachedInventory[0].description.appid == gameId && !$scope.selectedGame) {
    		 $scope.selectedGame = gameId;
    		 $scope.inventory = cachedInventory;
    		 console.log($scope.inventory);
    		 $scope.filters = InventoryService.getCachedFilters();
        	 $scope.search = {};

	       	 $scope.inventoryUnavailable = false;
	       	 $scope.steamUnavailable = false;

	    	 $rootScope.isLoading = false;
	    	  
        	 return;
    	 }
    	 
    	 $scope.getInventory(gameId);
	  };
	  
	  $scope.refreshInventory = function() {
		  $rootScope.isLoading = true;
		  InventoryService.refreshUserInventory($scope.selectedGame, cb_get_inventory_success, ApplicationUtils.cb_error_handler);
	  };
      
      $scope.getInventory = function(gameId) {
    	  $rootScope.isLoading = true;
    	  $scope.inventoryUnavailable = false;
    	  $scope.steamUnavailable = false;
    	  
    	  $scope.selectedGame = gameId;
    	  $scope.inventory = [];
 		  $scope.gameFilters.selectedGame = gameId;
    	  InventoryService.clearCachedInventory();
    	  InventoryService.clearCachedFilters();
    	  InventoryService.getUserInventory(gameId, cb_get_inventory_success, cb_get_inventory_error);
      };
      
      $scope.validateSelectedItems = function() {
    	  if (!$scope.selectedItems) return false;
    	  
    	  if ($scope.selectedItems.length == 0) return false;
    	  
    	  for (var item in $scope.selectedItems) { 
    		  if (!$scope.selectedItems[item].price) return false;     		  
    	  }
    	  
    	  return true;
      }
      
      $scope.getPendingTrades = function() {
    	  $rootScope.isLoading = true;
    	  InventoryService.getPendingTrades(cb_get_pending_sales_success, ApplicationUtils.cb_error_handler);
      };
      
      $scope.dropSuccessHandler = function($event, item, array){
    	  var index = array.indexOf(item);
		  
		  if (index > -1) {
			  array.splice(index, 1);
		  }
	  };
		
	  $scope.onDrop = function($event,$data,array){
		  array.push($data);
	  };
	  
	  $scope.removeItem = function(item) {
		  if (item.description.appid == $scope.selectedGame) {
			  $scope.inventory.push(item);
			  $scope.detailedItem = '';
			  
			  $scope.inventory = $scope.inventory.sort(function(a, b) {
				  return (a.description.market_name > b.description.market_name) ? 1 : ((a.description.market_name < b.description.market_name) ? -1 : 0);
			  });
		  }
		  
		  var index = $scope.selectedItems.indexOf(item);
		  
		  if (index > -1) {
			  $scope.selectedItems.splice(index, 1);
		  }
	  }
	  
	  $scope.addItem = function(item) {
		  $scope.doubleClickFlag = true;
		  
		  index = $scope.inventory.indexOf(item);
		  $scope.inventory.splice(index, 1);
		  
		  $scope.selectedItems.push(item);
	  }
	  
	  $scope.detailedView = function(item) {
		  $scope.doubleClickFlag = false;
		  
		  $timeout(function(){
			  if ($scope.doubleClickFlag == true) return;
			  
			  $scope.inventory = $scope.inventory.sort(function(a, b) {
				  return (a.description.market_name > b.description.market_name) ? 1 : ((a.description.market_name < b.description.market_name) ? -1 : 0);
			  });
			  
			  if ($scope.detailedItem == item.id) {
				  $scope.detailedItem = '';				  
			  } else {
				  index = $scope.inventory.indexOf(item);
				  newIndex = index + $scope.columns - (index % $scope.columns);
				  if ((newIndex + 1) % 12 == 1) newIndex = newIndex - $scope.columns;
				  $scope.inventory.splice(newIndex, 0, $scope.inventory.splice(index, 1)[0]);
				  $scope.detailedItem = item.id;
			  }
		  }, 200);		  
		  
	  }
	  
	  $scope.confirmTradeLink = function(tradeLink) {
    	  $rootScope.isLoading = true;
    	  var json = {'link_trade' : tradeLink };
    	  SettingsService.setTradeLink(json, $scope.sellSelectedItems, ApplicationUtils.cb_error_handler);
      };
	  
	  $scope.sellSelectedItems = function() {
		  var selectedItemsJson = [];
		  for (var index = 0; index < $scope.selectedItems.length; index++) {
			   var itemJson = {
				   "price" : $scope.selectedItems[index].price * 100,
				   "item" : {
					   "app_id": $scope.selectedItems[index].description.appid,
					   "asset_id": $scope.selectedItems[index].id,
					   "class_id": $scope.selectedItems[index].classid,
					   "instance_id": $scope.selectedItems[index].instanceid
				   }
			   };
			   selectedItemsJson.push(itemJson);
		   }
		  InventoryService.sellSelectedItems(selectedItemsJson, $scope.getPendingTrades, ApplicationUtils.cb_error_handler);
	  }
	  
	  $scope.beginTrade = function() {
		  InventoryService.saveSelectedItemsHistory($scope.selectedItems);
		  $scope.activeSell = true;
		  $scope.applicationUtils.setPath([{text: 'Продать'}, {text: 'Шаг'}]);
		  $scope.applicationUtils.setStep(1, 2);
	  }
	  
	  $scope.cancelTrade = function() {
		  $scope.applicationUtils.raisePopup('Отмена продажи', 'Вы уверены?', [{text: 'Да', red: 'red', func: $scope.doCancelTrade}, {text: 'Нет', func: $scope.applicationUtils.closePopup}]);
	  }
	  
	  $scope.doCancelTrade = function() {
		  $scope.applicationUtils.closePopup();
		  if ($scope.currentTrade) {
			  $rootScope.isLoading = true;
			  InventoryService.deleteTrade($scope.currentTrade.trade_id, cb_cancel_sale_success, ApplicationUtils.cb_error_handler);
		  } else {
			  $scope.resetSale();  		  
		  }
	  }
	  
	  $scope.skipToSale = function() {
		  $rootScope.isLoading = false;
		  $scope.selectedItems = InventoryService.getSelectedItemsHistory();
		  $scope.activeSell = true;
		  $scope.applicationUtils.setPath([{text: 'Продать'}, {text: 'Шаг'}]);
		  $scope.applicationUtils.setStep(1, 2);
		  
		  if($scope.currentTrade) {
			  $scope.applicationUtils.setStep(2, 2);
			  $scope.secondStep = true;
			  
			  $scope.checkStatus = $interval($scope.tradeStatusCheck, 5000);
		  }
	  }
	  
	  $scope.tradeStatusCheck = function() {
		  $scope.counter++;
		  if ($scope.counter > 2) {
			  $scope.stopCheck();
			  $scope.showCheckManual = true;
			  return;
		  }
		  
		  $scope.checkTradeStatus();
		  
	  }
	  
	  $scope.stopCheck = function() {
		  if(angular.isDefined($scope.checkStatus)) {
			  $scope.counter = 0;
			  $interval.cancel($scope.checkStatus);
			  $scope.checkStatus = undefined;
          }
      };
      
      $scope.checkTradeStatus = function() {
    	  InventoryService.checkTradeStatus($scope.currentTrade.trade_id, cb_trade_status_success, cb_trade_status_failed);
      };
      
      $scope.confirmTrade = function() {
    	  $rootScope.isLoading = true;
    	  InventoryService.confirmTrade($scope.currentTrade.trade_id, cb_trade_confirm_success, ApplicationUtils.cb_error_handler);
      };
      
      $scope.retryTrade = function() {
    	  $rootScope.isLoading = true;
    	  InventoryService.retryTrade($scope.currentTrade.trade_id, cb_trade_retry_success, cb_trade_retry_failed);
      };
      
      $scope.resetSale = function() {
    	  $scope.stopCheck();
    	  $scope.currentTrade = null;
    	  $scope.showCheckManual = false;
		  $scope.showCheckSuccess = false;
		  $scope.activeSell = false;
		  $scope.secondStep = false;
		  $scope.applicationUtils.setPath('Продать');
		  $scope.applicationUtils.setStep(0, 0);
		  InventoryService.clearSelectedItemsHistory();
		  $scope.selectedItems = [];
		  if (!$scope.selectedGame) $scope.selectedGame = 570;
		  $scope.getInventory($scope.selectedGame);
      };
      
      //CALL BACKS
      var cb_trade_retry_success = function() {
    	  $scope.sellSelectedItems();
      };
      
      var cb_trade_retry_failed = function() {
    	  $scope.applicationUtils.raisePopup('Ошибка', 'Не удалось создать обмен. Попробовать еще раз?', [{text: 'Да', func: $scope.retryTrade}, {text: 'Нет', red: 'red', func: $scope.resetSale}]);
      };
      
      var cb_trade_confirm_success = function() {
    	  $rootScope.isLoading = false;
    	  $scope.resetSale();
    	  $scope.selectedItems = [];
    	  ApplicationUtils.raisePopup('Статус обмена', 'Обмен успешно произведен');
      };

      var cb_trade_status_success = function(data) {
    	  var response = angular.fromJson(data);
    	  
    	  if(response.status_trade == 'created') {
    		  $scope.stopCheck();
    		  $scope.showCheckManual = false;
    		  $scope.showCheckSuccess = true;
    		  return;
    	  }
    	  
    	  if(response.status_trade == 'failed') {
    		  $scope.applicationUtils.raisePopup('Ошибка', 'Не удалось создать обмен. Попробовать еще раз?', [{text: 'Да', func: $scope.retryTrade}, {text: 'Нет', red: 'red', func: $scope.resetSale}]);
    		  return;
    	  }
    	  
    	  if ($scope.showCheckManual) ApplicationUtils.raisePopup('Статус обмена', response.status_trade);
      };
      
      var cb_trade_status_failed = function() {
    	  ApplicationUtils.raisePopup('Статус обмена', 'Произошла внутренняя ошибка, ваш обмен не был создан. Попробуйте повторить попытку позднее.');
    	  $scope.resetSale();
      }
      
      var cb_get_inventory_success = function(data) {
    	  $rootScope.isLoading = false;
    	  
          var response = angular.fromJson(data);
          var descriptionsObject = response.rgDescriptions;          
          var inventoryObject = response.rgInventory;
          
          $scope.inventory = [];
          $scope.search = '';
          $scope.filters = [];
          
          for (var itemObject in inventoryObject) {        	  
        	  for (var itemDescription in descriptionsObject) {
        		  if (descriptionsObject[itemDescription].classid == inventoryObject[itemObject].classid && descriptionsObject[itemDescription].instanceid == inventoryObject[itemObject].instanceid) {
        			  inventoryObject[itemObject].description = descriptionsObject[itemDescription];
        			  inventoryObject[itemObject].tags = {};
        			  for (var itemTag in descriptionsObject[itemDescription].tags) {
        				  inventoryObject[itemObject].tags[descriptionsObject[itemDescription].tags[itemTag].category] = descriptionsObject[itemDescription].tags[itemTag].internal_name;
        				  
        				  if (inventoryObject[itemObject].description.tradable == 1) {
	        				  if ($scope.filters.indexOf(descriptionsObject[itemDescription].tags[itemTag].category) > -1) {
	        					  if ($scope.filters[descriptionsObject[itemDescription].tags[itemTag].category].indexOf(descriptionsObject[itemDescription].tags[itemTag].internal_name) == -1) {
	        						  $scope.filters[descriptionsObject[itemDescription].tags[itemTag].category].push(descriptionsObject[itemDescription].tags[itemTag].internal_name);
	        					  }        					  
	        				  } else {
	        					  $scope.filters.push(descriptionsObject[itemDescription].tags[itemTag].category);
	        					  $scope.filters[descriptionsObject[itemDescription].tags[itemTag].category] = [];
	        				  }
        				  }
        			  }
        		  }        		  
        	  }
        	  
        	  if (inventoryObject[itemObject].description.tradable == 1) {
        		  var alreadyThere = false;

        		  for (var i = 0; i < $scope.selectedItems.length; i++) {
        			  var price = $scope.selectedItems[i].price;
        			  delete $scope.selectedItems[i].price;
        			  if (angular.equals(inventoryObject[itemObject], $scope.selectedItems[i])) alreadyThere = true;
        			  $scope.selectedItems[i].price = price;
          		  }
        		  
        		  if (!alreadyThere) $scope.inventory.push(inventoryObject[itemObject]);
        	  }        	  

        	  InventoryService.saveCachedInventory($scope.inventory);
        	  InventoryService.saveCachedFilters($scope.filters);
          }
          
          $scope.inventory = $scope.inventory.sort(function(a, b) {
        	  return (a.description.market_name > b.description.market_name) ? 1 : ((a.description.market_name < b.description.market_name) ? -1 : 0);
          });

          if ($scope.inventory.length == 0) {        	  
        	  $scope.inventoryUnavailable = true;
          }
          
          console.log($scope.inventory);
          console.log($scope.filters);
      };
      
      var cb_get_inventory_error = function(data) {
    	  $rootScope.isLoading = false;
    	  
    	  var response = angular.fromJson(data);
    	  //TODO: move this logic to common error handler
    	  //alert('Error occured, status =  ' + response.status + ', error = ' + response.error + ', error_code = ' + response.error_code);
    	  if (response.error_code == '0') $scope.steamUnavailable = true;
      };
      
      var cb_get_pending_sales_success = function(data) {
    	  var response = angular.fromJson(data);
    	  if (response.is)
    	  {
    		  $scope.currentTrade = response.trade;
    		  $scope.skipToSale();
    	  }
    	  else
    	  {
    		 if (InventoryService.isSelectedItemsHistoryEmpty())
    	     {
    		   $scope.selectGame(570);
    	     }
    		 else
    		 {
    			 $scope.skipToSale();
    		 }
    	  }
      };
      
      var cb_cancel_sale_success = function(data) {
    	  $rootScope.isLoading = false;
    	  $scope.resetSale();
      };
      
	  $scope.adjustGrid();
	  $scope.getPendingTrades();
   },

]);