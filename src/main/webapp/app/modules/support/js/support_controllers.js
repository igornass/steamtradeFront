var supportControllers = angular.module('Support.controllers', []);

supportControllers.controller('SupportContentCtrl', ['$scope', 'ApplicationUtils',
   function($scope, ApplicationUtils)
   {
	 var ctrl = this;
	 $scope.applicationUtils = ApplicationUtils;
	 $scope.applicationUtils.setPath('Поддержка');
	 $scope.applicationUtils.setStep(0, 0);
	 
  }
]);                                 
                      