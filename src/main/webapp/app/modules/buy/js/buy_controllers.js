var buyControllers = angular.module('Buy.controllers', []);

buyControllers.controller('BuyContentCtrl', ['$scope', '$rootScope', '$window', 'OffersService', 'ApplicationUtils', 'GameFilters', 'currentPage', '$state',
   function($scope, $rootScope, $window, OffersService, ApplicationUtils, GameFilters, currentPage, $state)
   {
	 var ctrl = this;
	 $scope.offers = {};
	 $scope.search = {};
	 $scope.Math = window.Math;
	 $scope.applicationUtils = ApplicationUtils;
	 $scope.applicationUtils.setPath('Купить');
	 $scope.applicationUtils.setStep(0, 0);
	  $scope.gameFilters = GameFilters;	
	  $scope.gameFilters.clearFilters();
	  $scope.currentPage = currentPage;
	  $scope.currentPage.page = parseInt($scope.currentPage.page);
	  $scope.totalPages = [];
	  
	  $scope.getOffersBtn = function() {
		  var startingPrice = null;
		  var endingPrice = null;
		  var name = null
		  var tags = [];
		  var sort = null;
		  var order = null;
		  
		  if ($scope.sort && $scope.sort.id == 1) {
			  sort = 'price';
		  }
		  
		  if ($scope.sort && $scope.sort.id == 2) {
			  sort = 'price';
			  order = 'desc';
		  }
		  
		  if ($scope.search.price) {
			  startingPrice = $scope.search.price.from * 100 + '';
			  endingPrice = $scope.search.price.to * 100 + '';
		  }
		  
		  if ($scope.search.description) {
			  name = $scope.search.description.market_name;
		  }
		  
		  for (var tag in $scope.gameFilters.tags) {
			  if ($scope.gameFilters.tags[tag]) {
				  for (var i = 0; i < $scope.gameFilters.tags[tag].length; i++) {
					  tags.push($scope.gameFilters.tags[tag][i]);
				  }
			  }
		  }
		  
		  $scope.getOffers($scope.selectedGame, null, $scope.currentPage.page, startingPrice, endingPrice, name, sort, order, tags);
	  };
     
     $scope.adjustGrid = function() {		  
    	 if ($window.innerWidth <= 400)
    		 $scope.columns = 1;
    	 else if ((($window.innerWidth > 400) && ($window.innerWidth <= 650)) ||
    			 (($window.innerWidth > 720) && ($window.innerWidth <= 850)) ||
    			 (($window.innerWidth > 940) && ($window.innerWidth <= 1050)))
    		 $scope.columns = 2;
    	 else if ((($window.innerWidth > 650) && ($window.innerWidth <= 720)) ||
    			 (($window.innerWidth > 850) && ($window.innerWidth <= 940)) ||
    			 (($window.innerWidth > 1050) && ($window.innerWidth <= 1150)))
    		 $scope.columns = 3;
    	 else
    		 $scope.columns = 4;
     }
	  
     angular.element($window).bind('resize', function() {
    	 $scope.$apply(function() {
    		 $scope.adjustGrid();
    	 });
     });
	 
     $scope.clearCachedOffers = function() {
    	 OffersService.clearCachedOffers();
     };
     
     $scope.selectGame = function(app_id) {
    	 var cachedOffers = OffersService.getCachedOffers(); 
    	 
    	 if (cachedOffers && cachedOffers[0] && cachedOffers[0].app_id == app_id) {
    		 $scope.selectedGame = app_id;
    		 $scope.gameFilters.selectedGame = app_id;
    		 $scope.offers = cachedOffers;
        	 $scope.search = {};
        	 
        	 $scope.totalPages = ["1"];
        	 
        	 if ($scope.currentPage.page < 4) {
        		 for (i = 2; i < $scope.currentPage.page + 1; i++) {
        			 $scope.totalPages.push(i);
        		 }
        	 } else {
        		 $scope.totalPages.push('...');
        		 $scope.totalPages.push($scope.currentPage.page - 1);
        		 $scope.totalPages.push($scope.currentPage.page);
        	 }
        	 
        	 return;
    	 }
    	 
    	 $scope.selectedGame = app_id;
    	 $scope.gameFilters.selectedGame = app_id;
		 $scope.gameFilters.clearFilters();
    	 $scope.offers = {};
    	 $scope.search = {};
    	 
		  var sort = null;
		  var order = null;
		  
		  if ($scope.sort && $scope.sort.id == 1) {
			  sort = 'price';
		  }
		  
		  if ($scope.sort && $scope.sort.id == 2) {
			  sort = 'price';
			  order = 'desc';
		  }
    	 
    	 $scope.getOffers($scope.selectedGame, null, null, null, null, null, sort, order, null);
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
    	 $scope.offers = {};
    	 OffersService.getOffers(app_id, page_size, page, start_price, finish_price, market_hash_name,
    			 sort_by, type_sort, tags, ctrl.cb_get_offers_success, ApplicationUtils.cb_error_handler);
     };
      
     ctrl.cb_get_offers_success = function(data) {
    	 $rootScope.isLoading = false;
    	 response = angular.fromJson(data);
    	 console.log(response);
    	 $scope.offers = response;

    	 if ($scope.currentPage.page > Math.ceil($scope.offers.total_count/12)) {
    		 $state.go(STATE_BUY, {game: $scope.selectedGame, page: 1});
    	 }
    	 
    	 $scope.totalPages = ["1"]
    	 
    	 if ($scope.currentPage.page < 4) {
    		 for (i = 2; i < $scope.currentPage.page + 1; i++) {
    			 $scope.totalPages.push(i);
    		 }
    	 } else {
    		 $scope.totalPages.push('...');
    		 $scope.totalPages.push($scope.currentPage.page - 1);
    		 $scope.totalPages.push($scope.currentPage.page);
    	 }
    	 
    	 if ($scope.currentPage.page + 2 < Math.ceil(100/12)) {
    		 $scope.totalPages.push($scope.currentPage.page + 1);
    		 $scope.totalPages.push('...');
    		 $scope.totalPages.push(Math.ceil(100/12));
    	 } else {
    		 for (i = $scope.currentPage.page + 1; i < Math.ceil($scope.offers.total_count/12) + 1; i++) {
    			 $scope.totalPages.push(i);
    		 }
    	 }    	 
    	 
    	 OffersService.saveCachedOffers($scope.offers);
    	 console.log($scope.offers);

     };
     
     
     $scope.buyButton = function(name) {
    	 $rootScope.isLoading = true;
    	 OffersService.getItemOffers($scope.selectedGame, name, $scope.buyButtonCallback, ApplicationUtils.cb_error_handler);
     };
     
     $scope.buyButtonCallback = function(data) { 
    	 $rootScope.isLoading = false;
    	 response = angular.fromJson(data);
    	 
    	 id = response[0].id;
    	 price = response[0].price / 100;
    	 name = response[0].item.name;

    	 var title = "";
    	 var body = "";
    	 var buttons = [];
    	 
    	 if (!$scope.isLoggedIn) {
    		 title = 'Вы не авторизованы';
    		 body = 'Для покупки предметов необходимо войти через Steam'
    		 
    		 $scope.applicationUtils.raisePopup(title, body);
    		 return;
    	 }
    	 
    	 if (!$scope.currentUser.trader) {
    		 title = 'Вы не можете покупать предметы';
    		 body = 'Для подключения возможности покупки предметов подтвердите свой аккаунт с помощью мобильного телефона в <a href="#/settings">Настройках</a>'
    			 
    		 $scope.applicationUtils.raisePopup(title, body);
    		 return;
    	 }
    	 
    	 $scope.selectedOffer = id;
    	 
    	 title = 'Подтвердите покупку';
    	 body = 'Вы покупаете ' + name + ' за ' + price + 'руб.<br>Подтверждая покупку вы соглашаетесь с <a href="#/contract">условиями агентского договора</a>';
    	 
    	 buttons = [
    	            { text: 'Я подтверждаю', func: $scope.buySelectedOffer},
    	            { text: 'Отмена', red: 'red', func: ApplicationUtils.closePopup}
    	            ]
    	 
    	 $scope.applicationUtils.raisePopup(title, body, buttons);
    	 
	 };
     
     $scope.buySelectedOffer = function() {
    	 $rootScope.isLoading = true;
    	 ApplicationUtils.closePopup();
    	 OffersService.buyItem($scope.selectedOffer, ctrl.cb_buy_item_success, ApplicationUtils.cb_error_handler);    	 
	 };
     
     ctrl.cb_buy_item_success = function(data) {
    	 $rootScope.isLoading = false;
    	 var response = angular.fromJson(data);
    	 title = 'Предмет успешно куплен.';
		 body = 'Мы отправили обмен на ваш аккаунт. Статус обменов вы можете посмотреть <a href="#/trades">здесь</a>'
			 
		 $scope.applicationUtils.raisePopup(title, body);
     };
       
     $scope.adjustGrid();     
	 $scope.selectGame($scope.currentPage.game);
   }
]);

buyControllers.controller('ItemDetailsCtrl', ['$scope', '$rootScope', '$sce', 'OffersService', 'ApplicationUtils', 'itemDetails',
   function($scope, $rootScope, $sce, OffersService, ApplicationUtils, itemDetails)                                          
   {
	 var ctrl = this;
	 $scope.applicationUtils = ApplicationUtils;
	 
	 $scope.item = undefined;
	 $scope.offers = [];
	 $scope.selectedOffer = undefined;
	 
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
     
     $scope.buyButton = function(id, price, name) {    	 
    	 var title = "";
    	 var body = "";
    	 var buttons = [];
    	 
    	 if (!$scope.isLoggedIn) {
    		 title = 'Вы не авторизованы';
    		 body = 'Для покупки предметов необходимо войти через Steam'
    		 
    		 $scope.applicationUtils.raisePopup(title, body);
    		 return;
    	 }
    	 
    	 if (!$scope.currentUser.trader) {
    		 title = 'Вы не можете покупать предметы';
    		 body = 'Для подключения возможности покупки предметов подтвердите свой аккаунт с помощью мобильного телефона в <a href="#/settings">Настройках</a>'
    			 
    		 $scope.applicationUtils.raisePopup(title, body);
    		 return;
    	 }
    	 
    	 $scope.selectedOffer = id;
    	 
    	 title = 'Подтвердите покупку';
    	 body = 'Вы покупаете ' + name + ' за ' + price + 'руб.<br>Подтверждая покупку вы соглашаетесь с <a href="#/contract">условиями агентского договора</a>';
    	 
    	 buttons = [
    	            { text: 'Я подтверждаю', func: $scope.buySelectedOffer},
    	            { text: 'Отмена', red: 'red', func: ApplicationUtils.closePopup}
    	            ]
    	 
    	 $scope.applicationUtils.raisePopup(title, body, buttons);
    	 
	 };
     
     $scope.buySelectedOffer = function() {
    	 $rootScope.isLoading = true;
    	 $scope.applicationUtils.closePopup();
    	 OffersService.buyItem($scope.selectedOffer, ctrl.cb_buy_item_success, ApplicationUtils.cb_error_handler);    	 
	 };
     
     ctrl.cb_buy_item_success = function(data) {
    	 $rootScope.isLoading = false;
    	 var response = angular.fromJson(data);
    	 title = 'Предмет успешно куплен.';
		 body = 'Мы отправили обмен на ваш аккаунт. Статус обменов вы можете посмотреть <a href="#/trades">здесь</a>'
			 
		 $scope.applicationUtils.raisePopup(title, body);
     };
	 
     $rootScope.isLoading = true;
	 OffersService.getItemOffers(itemDetails.game, itemDetails.item, ctrl.cb_get_offers_success, ApplicationUtils.cb_error_handler);
	 $scope.applicationUtils.setPath([{text: 'Купить'}, {text: GAMES[itemDetails.game], link: '#/buy/' + itemDetails.game}, {text: itemDetails.item}]);
	 
  }
]);                                 
                                              
                                              