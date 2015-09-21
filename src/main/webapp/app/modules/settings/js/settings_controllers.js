var settingsControllers = angular.module('Settings.controllers', []);

settingsControllers.controller('SettingsContentCtrl', ['$scope', '$rootScope', '$timeout', 'SettingsService', 'ApplicationUtils',
   function($scope, $rootScope, $timeout, SettingsService, ApplicationUtils)
   {
	 var ctrl = this;
	 $scope.applicationUtils = ApplicationUtils;
	 $scope.applicationUtils.setPath('Настройки');
	 $scope.applicationUtils.setStep(0, 0);

	 $scope.user = {};
	 $scope.operationId = undefined;
	 
     $scope.getUserDetails = function() {
    	 $rootScope.isLoading = true;
    	 SettingsService.getUserDetails(ctrl.cb_get_user_details_success, ApplicationUtils.cb_error_handler);
     };

     ctrl.cb_get_user_details_success = function(data) {
    	 $rootScope.isLoading = false;
    	 $scope.user = angular.fromJson(data);
    	 SettingsService.getOperations(ctrl.cb_get_operations_success, ApplicationUtils.cb_error_handler);
     };
     
     ctrl.cb_get_operations_success = function(data) {
    	 $rootScope.isLoading = false;
    	 response = angular.fromJson(data);
    	 for (operation in response) {
    		 if (response[operation].alias == "setPhone") {
    			 $scope.operationId = response[operation].operation_id;
    			 var currentTime = new Date().getTime();
    			 $scope.counter = Math.floor((response[operation].repeat_sms_time - currentTime) / 1000);
    			 if ($scope.counter > 0) {
    				 $scope.countdown();
    			 } else {
    				 $scope.counter = 0;
    			 }
    			 return;
    		 }
    	 }
     };
     
     $scope.countdown = function() {
	    stopped = $timeout(function() {
	     if ($scope.counter <= 0) {
	    	 $scope.counter = 0;
	    	 return;
	     }
	     $scope.counter--;   
	     if ($scope.counter > 0) $scope.countdown();
	    }, 1000);
	 };
     
     $scope.setTradeLink = function(tradeLink) {
    	 $rootScope.isLoading = true;
    	 var json = {'link_trade' : tradeLink };
    	 SettingsService.setTradeLink(json, ctrl.cb_set_trade_link_success, ApplicationUtils.cb_error_handler);
     };

     ctrl.cb_set_trade_link_success = function(data) {
    	 $rootScope.isLoading = false;
    	 response = angular.fromJson(data);
    	 console.log(response);
     };
     
     $scope.setPhone = function(phone) {
    	 $rootScope.isLoading = true;
    	 var json = {'phone' : phone };
    	 SettingsService.setPhone(json, ctrl.cb_set_phone_success, ApplicationUtils.cb_error_handler);
     };

     ctrl.cb_set_phone_success = function(data) {
    	 $rootScope.isLoading = false;
    	 response = angular.fromJson(data);
    	 $scope.operationId = response.operation_id;
		 var currentTime = new Date().getTime();
		 $scope.counter = Math.floor((response.repeat_sms_time - currentTime) / 1000);
		 $scope.countdown();
     };
     
     $scope.sendCode = function(code) {
    	 $rootScope.isLoading = true;
    	 var json = {'code' : code };
    	 SettingsService.sendCode($scope.operationId, json, ctrl.cb_send_code_success, ApplicationUtils.cb_error_handler);
     };

     ctrl.cb_send_code_success = function(data) {
    	 $scope.operationId = undefined;
         
         $scope.getUserDetails();
     };
     
     $scope.resendCode = function() {
    	 $rootScope.isLoading = true;
    	 SettingsService.resendCode($scope.operationId, ctrl.cb_set_phone_success, ApplicationUtils.cb_error_handler);
     };
     
     $scope.cancelOperation = function() {
    	 $rootScope.isLoading = true;
    	 SettingsService.cancelOperation($scope.operationId, ctrl.cb_cancel_success, ApplicationUtils.cb_error_handler);
     };
     
     ctrl.cb_cancel_success = function() {
    	 $rootScope.isLoading = false;
    	 $scope.operationId = undefined;
    	 $scope.counter = 0;
     };
       
     $scope.getUserDetails();
   }
]);                      
                                              
                                              