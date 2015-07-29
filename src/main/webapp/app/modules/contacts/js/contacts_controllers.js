var contactsControllers = angular.module('Contacts.controllers', []);

contactsControllers.controller('ContactsContentCtrl', ['$scope', 'ApplicationUtils',
   function($scope, ApplicationUtils)
   {
	 var ctrl = this;
	 $scope.applicationUtils = ApplicationUtils;
	 $scope.applicationUtils.setPath('Контакты');
	 $scope.applicationUtils.setStep(0, 0);
	 
  }
]);                                 
                                              
                                              