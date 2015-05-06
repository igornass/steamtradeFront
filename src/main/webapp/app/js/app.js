'use strict';

var app = angular.module('SteamShop',[
	'SteamShop.commonControllers', 
	'SteamShop.commonServices', 
	//include modules
	'SteamShop.Buy',
	'SteamShop.Sell',
	'SteamShop.Lots',
	'SteamShop.Exchange',
	'SteamShop.Balance',
	'SteamShop.Settings',

	'SteamShop.Agreement',
	'SteamShop.Contract',
	'SteamShop.Contacts',
	'SteamShop.Support',
	
	 //include plugins
	'angularUtils.directives.dirPagination',
	'ui.router',
	'ang-drag-drop',
	'ngTouch'
]);

app.config(function(paginationTemplateProvider, $urlRouterProvider, $stateProvider) {
    paginationTemplateProvider.setPath('pagination.html');
    
    $stateProvider
    .state(STATE_BUY, {
        url: '/',
        templateUrl: 'app/modules/buy/view/ContentBuy.html',
        controller: 'BuyContentCtrl'
    })
    .state('buy_item_state', {
        url: '/item/{itemId}',
        templateUrl: 'app/modules/buy/view/ContentBuy.html',
        
        resolve: {
        	offersService: 'OffersService',
            itemDetails: function(offersService, $stateParams){

                var itemId = $stateParams.itemId;
                return itemId;
            }
        },
    
        controller: 'ItemDetailsCtrl'
    })
    .state(STATE_SELL, {
    	url: '/sell',
        templateUrl: 'app/modules/sell/view/ContentSell.html',        
        controller: 'SellContentCtrl'
    })
    .state(STATE_LOTS, {
    	url: '/lots',
        templateUrl: 'app/modules/lots/view/ContentLots.html'     
    })
    .state(STATE_EXCHANGE, {
    	url: '/exchange',
        templateUrl: 'app/modules/exchange/view/ContentExchange.html'     
    })
    .state(STATE_BALANCE, {
    	url: '/balance',
        templateUrl: 'app/modules/balance/view/ContentBalance.html',        
        controller: 'BalanceContentCtrl'     
    })
    .state(STATE_SETTINGS, {
    	url: '/settings',
        templateUrl: 'app/modules/settings/view/ContentSettings.html'     
    })
    .state(STATE_AGREEMENT, {
    	url: '/agreement',
        templateUrl: 'app/modules/agreement/view/ContentAgreement.html'     
    })
    .state(STATE_CONTRACT, {
    	url: '/contract',
        templateUrl: 'app/modules/contract/view/ContentContract.html'     
    })
    .state(STATE_CONTACTS, {
    	url: '/contacts',
        templateUrl: 'app/modules/contacts/view/ContentContacts.html'     
    })
    .state(STATE_SUPPORT, {
    	url: '/support',
        templateUrl: 'app/modules/support/view/ContentSupport.html'     
    })
    .state(STATE_VALID_OPENID, {
    	url: '/openid/valid?openid.ns&openid.mode&openid.op_endpoint&openid.claimed_id&openid.identity&openid.return_to&openid.response_nonce&openid.assoc_handle&openid.signed&openid.sig',
        controller: 'ValidateLoginCtrl'
    });
    
    $urlRouterProvider.otherwise('/');
});

app.run(function(AuthService) {
	//check auth token in cookies.
	if(!jQuery.isEmptyObject(AuthService.getAuthToken()))
	{
	   AuthService.updateUserDetails();
	}

});


