var agreementControllers = angular.module('Agreement.controllers', []);

agreementControllers.controller('AgreementContentCtrl', ['$scope', 'ApplicationUtils',
   function($scope, ApplicationUtils)
   {
	 var ctrl = this;
	 $scope.applicationUtils = ApplicationUtils;
	 $scope.applicationUtils.setPath('Пользовательское соглашение');
	 $scope.applicationUtils.setStep(0, 0);
	 
  }
]);                                 
                                              
                                              