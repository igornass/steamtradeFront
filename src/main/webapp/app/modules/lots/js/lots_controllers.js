var lotsControllers = angular.module('Lots.controllers', []);

lotsControllers.controller('LotsContentCtrl', ['$scope', '$rootScope', '$window', 'OffersService', 'ApplicationUtils',
   function($scope, $rootScope, $window, OffersService, ApplicationUtils)
   {
	 var ctrl = this;
	 $scope.applicationUtils = ApplicationUtils;
	 $scope.applicationUtils.setPath('Лоты');
	 $scope.applicationUtils.setStep(0, 0);
	 
	 $scope.initOffers = function(openedOffers) {
		 $scope.applicationUtils.closePopup();
		 
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
    		 var timestamp = $scope.offers[i].opening_time;
    		 if (!$scope.offers[i].opening_time) timestamp = $scope.offers[i].closing_time;
    		 $scope.offers[i].human_time = $scope.applicationUtils.humanTime(timestamp, true);
    	 }

    	 console.log($scope.offers);
     };
     
     ctrl.cb_delete_offer_success = function(data) {
		 $rootScope.isLoading = false;
		 title = 'Снятие лота';
    	 body = 'Лот успешно снят.';
    	 
    	 buttons = [
    	            { text: 'ОК', func: $scope.initOffers}
    	            ];
    	 
    	 args = true;
    	 
    	 $scope.applicationUtils.raisePopup(title, body, buttons, args);
     };
     
     //Inin opened offers
     $scope.initOffers(true);
   }
]);