var sellControllers = angular.module('Sell.controllers', []);

sellControllers.controller('SellContentCtrl', ['$scope', '$rootScope', '$timeout', '$window', 'InventoryService', 'ApplicationUtils',
   function($scope, $rootScope, $timeout, $window, InventoryService, ApplicationUtils)
   {
	  var ctrl = this;
	  
	  $scope.doubleClickFlag = true;
	  
	  $scope.inventory = [];
	  $scope.selectedItems = [];
	  $scope.applicationUtils = ApplicationUtils;
	  
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
	  }
	  
	  angular.element($window).bind('resize', function() {
		    $scope.$apply(function() {
		    	$scope.adjustGrid();
		    });
		});
      
      $scope.getInventory = function(gameId) {
    	  $rootScope.isLoading = true;
    	  $scope.inventoryUnavailable = false;
    	  $scope.steamUnavailable = false;
    	  
    	  $scope.selectedGame = gameId;
    	  InventoryService.getUserInventory(gameId, cb_get_inventory_success, cb_get_inventory_error);
      };
      
      
      $scope.getPendingTrades = function() {
    	  $rootScope.isLoading = true;
    	  InventoryService.getPendingTrades(cb_get_pending_sales_success, ApplicationUtils.cb_error_handler);
      };
      
      $scope.cancelCurrentSale = function() {
    	  $rootScope.isLoading = true;
    	  InventoryService.cancelCurrentSale(cb_cancel_sale_success, ApplicationUtils.cb_error_handler);
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
		  $scope.inventory.push(item);
		  $scope.detailedItem = '';
		  
		  $scope.inventory = $scope.inventory.sort(function(a, b) {
			  return (a.description.market_name > b.description.market_name) ? 1 : ((a.description.market_name < b.description.market_name) ? -1 : 0);
		  });
		  
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
	  
	  $scope.sellSelectedItems = function() {
		  $rootScope.isLoading = true;
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
		  InventoryService.sellSelectedItems(selectedItemsJson, cb_sell_items_success, ApplicationUtils.cb_error_handler);
	  }
      
      //CALL BACKS
      var cb_get_inventory_success = function(data) {
    	  $rootScope.isLoading = false;
    	  
          var response = angular.fromJson(data);
          var descriptionsObject = response.rgDescriptions;          
          var inventoryObject = response.rgInventory;
          
          $scope.inventory = [];
          $scope.search = '';
          $scope.filters = [];
          
          console.log(response);
          
          for (var itemObject in inventoryObject) {        	  
        	  for (var itemDescription in descriptionsObject) {
        		  if (descriptionsObject[itemDescription].classid == inventoryObject[itemObject].classid && descriptionsObject[itemDescription].instanceid == inventoryObject[itemObject].instanceid) {
        			  inventoryObject[itemObject].description = descriptionsObject[itemDescription];
        			  inventoryObject[itemObject].tags = {};
        			  for (var itemTag in descriptionsObject[itemDescription].tags) {
        				  inventoryObject[itemObject].tags[descriptionsObject[itemDescription].tags[itemTag].category] = descriptionsObject[itemDescription].tags[itemTag].name;
        				  
        				  if (inventoryObject[itemObject].description.tradable == 1) {
	        				  if ($scope.filters.indexOf(descriptionsObject[itemDescription].tags[itemTag].category) > -1) {
	        					  if ($scope.filters[descriptionsObject[itemDescription].tags[itemTag].category].indexOf(descriptionsObject[itemDescription].tags[itemTag].name) == -1) {
	        						  $scope.filters[descriptionsObject[itemDescription].tags[itemTag].category].push(descriptionsObject[itemDescription].tags[itemTag].name);
	        					  }        					  
	        				  } else {
	        					  $scope.filters.push(descriptionsObject[itemDescription].tags[itemTag].category);
	        					  $scope.filters[descriptionsObject[itemDescription].tags[itemTag].category] = [];
	        				  }
        				  }
        			  }
        		  }        		  
        	  }
        	  
        	  if (inventoryObject[itemObject].description.tradable == 1) $scope.inventory.push(inventoryObject[itemObject]);
        	  
          }
          
          $scope.inventory = $scope.inventory.sort(function(a, b) {
        	  return (a.description.market_name > b.description.market_name) ? 1 : ((a.description.market_name < b.description.market_name) ? -1 : 0);
          });

          if ($scope.inventory.length == 0) {        	  
        	  $scope.inventoryUnavailable = true;
          }
          
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
    		 alert("User must be redirected to the second step of the sale as there is unfinished trade data");
    	  }
    	  else
    	  {
    		 if (InventoryService.isSelectedItemsHistoryEmpty())
    	     {
    		   $scope.getInventory(570);
    	     }
    		 else
    		 {
    			 alert("User must be redirected to the second step of the sale as there is unfinished trade data");
    		 }
    	  }
      };    
      
      var cb_sell_items_success = function(data) {
    	  $rootScope.isLoading = false;
    	  var response = angular.fromJson(data);
      };
      
      var cb_cancel_sale_success = function(data) {
    	  $rootScope.isLoading = false;
    	  var response = angular.fromJson(data);
      };
      
	  $scope.adjustGrid();
	  $scope.getPendingTrades();
   },

]);