var settingsControllers = angular.module('Settings.controllers', []);

settingsControllers.controller('SettingsContentCtrl', ['$scope', '$rootScope', 'SettingsService', 'ApplicationUtils',
   function($scope, $rootScope, SettingsService, ApplicationUtils)
   {
	 var ctrl = this;
	 $scope.applicationUtils = ApplicationUtils;
	 $scope.applicationUtils.setPath('Настройки');

	 $scope.user = {};
	 $scope.operationId = undefined;
	 
     $scope.getUserDetails = function() {
    	 $rootScope.isLoading = true;
    	 SettingsService.getUserDetails(ctrl.cb_get_user_details_success, ApplicationUtils.cb_error_handler);
     };

     ctrl.cb_get_user_details_success = function(data) {
    	 $rootScope.isLoading = false;
    	 $scope.user = angular.fromJson(data);
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
    	 $scope.operationId = response.OPERATION_ID;
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
       
     $scope.getUserDetails();
   }
]);                      
                                              
                                              