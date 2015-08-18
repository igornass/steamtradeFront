var supportControllers = angular.module('Support.controllers', []);

supportControllers.controller('SupportContentCtrl', ['$scope', '$rootScope','ApplicationUtils', 'SupportService',
   function($scope, $rootScope, ApplicationUtils, SupportService)
   {
	 var ctrl = this;
	 $scope.applicationUtils = ApplicationUtils;
	 $scope.applicationUtils.setPath('Поддержка');
	 $scope.applicationUtils.setStep(0, 0);
	 
	 $scope.ticketSubjects = [];
	 $scope.tickets = [];
	 
	 
	 $scope.initSubjects = function() {
		 $rootScope.isLoading = true;
		 SupportService.getTicketSubjects(ctrl.cb_ticket_subjects_success, ApplicationUtils.cb_error_handler);
	 };
	 
	 $scope.initTickets = function() {
		 $rootScope.isLoading = true;
		 SupportService.getCurrentUserTickets(ctrl.cb_tickets_success, ApplicationUtils.cb_error_handler);
	 };
	 
	 $scope.createTicket = function(subjectId, message) {
		 $rootScope.isLoading = true;
		 var dataJson = {
		    "subject_id" : subjectId,
			"message" : message
		 };
		 SupportService.postNewTicket(dataJson, function() {
			 //re-init tickets
			 $scope.initTickets();
		 }, ApplicationUtils.cb_error_handler);
	 };
	 
	 $scope.addMessageToTicket = function(ticketId, message) {
		 $rootScope.isLoading = true;
		 var dataJson = { "message" : message };
		 SupportService.addMessageToTicket(ticketId, dataJson, function() {
			 //re-init tickets
			 $scope.initTickets();
		 }, ApplicationUtils.cb_error_handler);
	 };
	 
	 $scope.closeTicket = function(ticketId) {
		 $rootScope.isLoading = true;
		 SupportService.closeTicket(ticketId, function() {
			 //re-init tickets
			 $scope.initTickets();
		 }, ApplicationUtils.cb_error_handler);
	 };
	  
	  ctrl.cb_ticket_subjects_success = function(data) {
		  response = angular.fromJson(data);
		  $scope.ticketSubjects = response;
	  };
	  
	  ctrl.cb_tickets_success = function(data) {
		  response = angular.fromJson(data);
		  $scope.tickets = response;
		  $rootScope.isLoading = false;
	  };
	  
	  //entry point
	  $scope.initSubjects();
	  $scope.initTickets();
	 
  }
]);                                 
                      