var supportControllers = angular.module('Support.controllers', []);

supportControllers.controller('SupportContentCtrl', ['$scope', '$rootScope','ApplicationUtils', 'SupportService', '$timeout',
   function($scope, $rootScope, ApplicationUtils, SupportService, $timeout)
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
	 
	 $scope.closeTicketBtn = function (ticketId) {
		 title = 'Закрыть тикет';
    	 body = 'Вы уверены?';
    	 
    	 buttons = [
    	            { text: 'Да', func: $scope.closeTicket},
    	            { text: 'Нет', func: ApplicationUtils.closePopup}
    	            ];
    	 
    	 args = ticketId
    	 
    	 $scope.applicationUtils.raisePopup(title, body, buttons, args);
	 };	 
	 
	 $scope.setFocus = function(ticketId) {
		 $timeout(function(){ document.getElementById(ticketId).focus(); }, 50);
	 }
	 
	 $scope.addMessageToTicket = function(ticketId, message) {
		 $rootScope.isLoading = true;
		 var dataJson = { "message" : message };
		 SupportService.addMessageToTicket(ticketId, dataJson, function() {
			 //re-init tickets
			 $scope.initTickets();
		 }, ApplicationUtils.cb_error_handler);
	 };
	 
	 $scope.closeTicket = function(ticketId) {
		 ApplicationUtils.closePopup();
		 $rootScope.isLoading = true;
		 SupportService.closeTicket(ticketId, function() {
			 //re-init tickets
			 $scope.initTickets();
		 }, ApplicationUtils.cb_error_handler);
	 };
	  
	  ctrl.cb_ticket_subjects_success = function(data) {
		  response = angular.fromJson(data);
		  $scope.ticketSubjects = response;
		  console.log($scope.ticketSubjects);
	  };
	  
	  ctrl.cb_tickets_success = function(data) {
		  response = angular.fromJson(data);
		  $scope.tickets = response;
		  for (i = 0; i < $scope.tickets.length; i++) {
			  for (j = 0; j < $scope.tickets[i].messages.length; j++) {
				  $scope.tickets[i].messages[j].human_time =  $scope.applicationUtils.humanTime($scope.tickets[i].messages[j].creating_time, true);
			  }
    	  }
		  $scope.theme = {};
		  $rootScope.isLoading = false;
		  console.log($scope.tickets);
	  };
	  
	  //entry point
	  $scope.initSubjects();
	  $scope.initTickets();
	 
  }
]);                                 
                      