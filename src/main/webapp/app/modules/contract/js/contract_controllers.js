var contractControllers = angular.module('Contract.controllers', []);

contractControllers.controller('ContractContentCtrl', ['$scope', 'ApplicationUtils',
   function($scope, ApplicationUtils)
   {
	 var ctrl = this;
	 $scope.applicationUtils = ApplicationUtils;
	 $scope.applicationUtils.setPath('Агентский договор-оферта');
	 $scope.applicationUtils.setStep(0, 0);
	 
  }
]);                                 
                                              
                                              