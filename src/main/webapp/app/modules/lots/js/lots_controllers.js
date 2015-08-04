var lotsControllers = angular.module('Lots.controllers', []);

lotsControllers.controller('LotsContentCtrl', ['$scope', '$rootScope', '$window', 'OffersService', 'ApplicationUtils',
   function($scope, $rootScope, $window, OffersService, ApplicationUtils)
   {
	 var ctrl = this;
	 $scope.applicationUtils = ApplicationUtils;
	 $scope.applicationUtils.setPath('Лоты');
	 $scope.applicationUtils.setStep(0, 0);
	 
	 $scope.initOffers = function(openedOffers) {
		 $scope.openedOffers = openedOffers;
		 $scope.lots = [];
		 $rootScope.isLoading = true;
		 
		 if (openedOffers)
		 {
		    OffersService.getOpenOffers(ctrl.cb_init_offers_success, ApplicationUtils.cb_error_handler);
	     }
		 else
		 {
		   OffersService.getClosedOffers(ctrl.cb_init_offers_success, ApplicationUtils.cb_error_handler); 
		 }
     };
     
     $scope.deleteOfferById = function(offerId) {
		 $rootScope.isLoading = true;
         OffersService.deleteOfferById(offerId, ctrl.cb_delete_offer_success, ApplicationUtils.cb_error_handler);
     };
     
     ctrl.cb_init_offers_success = function(data) {
		 $rootScope.isLoading = false;
    	 $scope.offers = angular.fromJson(data);
    	 
    	 for (i = 0; i < $scope.offers.length; i++) {
    		 var date = new Date($scope.offers[i].opening_time);
    		 if (!$scope.offers[i].opening_time) date = new Date($scope.offers[i].closing_time);
    		 $scope.offers[i].human_time = date.getDate() + ' ' + MONTH[date.getMonth()] + ' ' + date.getFullYear() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    	 }

    	 console.log($scope.offers);
     };
     
     ctrl.cb_delete_offer_success = function(data) {
		 $rootScope.isLoading = false;
		 ApplicationUtils.raisePopup('Снятие лота', 'Лот успешно снят.');
     };
     
     //Inin opened offers
     $scope.initOffers(true);
   }
]);