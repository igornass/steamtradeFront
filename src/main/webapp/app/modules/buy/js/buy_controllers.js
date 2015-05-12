var buyControllers = angular.module('Buy.controllers', []);

buyControllers.controller('BuyContentCtrl', ['$scope', '$rootScope', '$window', 'OffersService', 'ApplicationUtils',
   function($scope, $rootScope, $window, OffersService, ApplicationUtils)
   {
	 var ctrl = this;
	 
	 $scope.offers = [];
	 $scope.search = {};
	 $scope.filters = {'Hero' : ['Weaver', 'Clockwerk'], 'Rarity' : ['Rare', 'Uncommon'], 'Quality' : ['Genuine', 'Unusual'], 'Type' : ['Wearable', 'Courier']};
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
	 
     $scope.selectGame = function(app_id) {
    	 $scope.selectedGame = app_id;
    	 $scope.offers = [];
    	 $scope.search = {};
    	 
    	 $scope.getOffers($scope.selectedGame, null, null, null, null, null, null, null, null);
     };
	 
     $scope.getOfferDetails = function(offerId) {
    	 $rootScope.isLoading = true;
    	 OffersService.getOfferDetails(offerId, ctrl.cb_get_offer_details_success, ApplicationUtils.cb_error_handler);
     };

     ctrl.cb_get_offer_details_success = function(data) {
    	 $rootScope.isLoading = false;
    	 var response = angular.fromJson(data);
     };
     
     $scope.getOffers = function(app_id, page_size, page, start_price, finish_price, market_hash_name, sort_by, type_sort, tags) {
    	 $rootScope.isLoading = true;
    	 OffersService.getOffers(app_id, page_size, page, start_price, finish_price, market_hash_name,
    			 sort_by, type_sort, tags, ctrl.cb_get_offers_success, ApplicationUtils.cb_error_handler);
     };
      
     ctrl.cb_get_offers_success = function(data) {
    	 $rootScope.isLoading = false;
    	 $scope.offers = [];
    	 response = angular.fromJson(data);
    	 console.log(response);

    	 for (var offer in response) {  
    		 response[offer].tags = {};
    		 for (var itemTag in response[offer].item.tags) {
    			 response[offer].tags[response[offer].item.tags[itemTag].category] = response[offer].item.tags[itemTag].internal_name;
    		 }
    		 
    		 if ($scope.offers.length == 0) {
    			 response[offer].count = 0;
				 $scope.offers.push(response[offer]);
    		 }
    		 
    		 listedAt = -1;
    		 
    		 for (var groupedOffer in $scope.offers) {
    			 if ($scope.offers[groupedOffer].item.name == response[offer].item.name) {
    				 listedAt = groupedOffer;
    			 }
    		 }
    		 
    		 if (listedAt >= 0) {
				 $scope.offers[listedAt].count = $scope.offers[listedAt].count + 1;
				 if ($scope.offers[listedAt].price > response[offer].price) $scope.offers[listedAt].price = response[offer].price;
    		 } else {
    			 response[offer].count = 1;
				 $scope.offers.push(response[offer]);
    		 }

    	 }
    	 
    	 console.log($scope.offers);

     };
       
     $scope.adjustGrid();
     $scope.selectGame(570);
   }
]);

buyControllers.controller('ItemDetailsCtrl', ['$scope', '$rootScope', '$sce', 'OffersService', 'ApplicationUtils', 'itemDetails',
   function($scope, $rootScope, $sce, OffersService, ApplicationUtils, itemDetails)                                          
   {
	 var ctrl = this;
	 $scope.applicationUtils = ApplicationUtils;
	 
	 $scope.item = {};
	 $scope.offers = {};
	 
	 $rootScope.isLoading = true;
	 
	 ctrl.cb_get_offers_success = function(data) {
    	 $scope.offers = angular.fromJson(data);
    	 
    	 if ($scope.offers.length > 0) {
    		 OffersService.getItemDetails(itemDetails.game, $scope.offers[0].item.class_id, $scope.offers[0].item.instance_id, ctrl.cb_get_item_success, ApplicationUtils.cb_error_handler)
    	 } else {
    		 alert('There are no offers for the requested item');
    		 $rootScope.isLoading = false;
    	 }
     };
     
     ctrl.cb_get_item_success = function(data) {
    	 $rootScope.isLoading = false;
    	 response = angular.fromJson(data);
    	 if ($scope.offers[0].item.instance_id) {
    		 $scope.item = response.result[$scope.offers[0].item.class_id + '_' + $scope.offers[0].item.instance_id];
    	 } else {
    		 $scope.item = response.result[$scope.offers[0].item.class_id];
    	 }
    	 
    	 $scope.item.descriptionsArray = [];
    	 
    	 for (var description in $scope.item.descriptions) {
    		 $scope.item.descriptionsArray.push($scope.item.descriptions[description]);    		 
    	 }
    	 
    	 console.log($scope.item);
    	 console.log('---');
    	 console.log($scope.offers);
     };
     
     $scope.toTrusted = function(html_code) {
	     return $sce.trustAsHtml(html_code);
	 }
	 
	 OffersService.getOffers(itemDetails.game, null, null, null, null, itemDetails.item,
			 null, null, null, ctrl.cb_get_offers_success, ApplicationUtils.cb_error_handler);
	 
  }
]);                                 
                                              
                                              