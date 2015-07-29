'use strict';

var app = angular.module('SteamShop',[
	'SteamShop.commonControllers', 
	'SteamShop.commonServices', 
	//include modules
	'SteamShop.Buy',
	'SteamShop.Sell',
	'SteamShop.Lots',
	'SteamShop.Trades',
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
	'ngTouch', 
	'ngSanitize',
	'ngStorage'
]);

app.config(function(paginationTemplateProvider, $urlRouterProvider, $stateProvider) {
    paginationTemplateProvider.setPath('pagination.html');
    
    $stateProvider
    .state(STATE_BUY, {
        url: '/buy/{game}',
        templateUrl: 'app/modules/buy/view/ContentBuy.html',
        
        resolve: {
            selectedGame: function($stateParams){
                return $stateParams.game;
            }
        },
        
        controller: 'BuyContentCtrl'
    })
    .state(STATE_BUY_ITEM, {
        url: '/item/{game}&{item}',
        templateUrl: 'app/modules/buy/view/ContentOffer.html',
        
        resolve: {
        	offersService: 'OffersService',
            itemDetails: function(offersService, $stateParams){

                var item = {game: $stateParams.game, item: $stateParams.item};
                return item;
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
        templateUrl: 'app/modules/lots/view/ContentLots.html',
        controller: 'LotsContentCtrl'
    })
    .state(STATE_TRADES, {
    	url: '/trades',
        templateUrl: 'app/modules/trades/view/ContentTrades.html',
        controller: 'TradesContentCtrl'
    })
    .state(STATE_BALANCE, {
    	url: '/balance',
        templateUrl: 'app/modules/balance/view/ContentBalance.html',        
        controller: 'BalanceContentCtrl'     
    })
    .state(STATE_SETTINGS, {
    	url: '/settings',
        templateUrl: 'app/modules/settings/view/ContentSettings.html',        
        controller: 'SettingsContentCtrl'     
    })
    .state(STATE_AGREEMENT, {
    	url: '/agreement',
        templateUrl: 'app/modules/agreement/view/ContentAgreement.html',
        controller: 'AgreementContentCtrl'
    })
    .state(STATE_CONTRACT, {
    	url: '/contract',
        templateUrl: 'app/modules/contract/view/ContentContract.html',
        controller: 'ContractContentCtrl'
    })
    .state(STATE_CONTACTS, {
    	url: '/contacts',
        templateUrl: 'app/modules/contacts/view/ContentContacts.html',
        controller: 'ContactsContentCtrl'
    })
    .state(STATE_SUPPORT, {
    	url: '/support',
        templateUrl: 'app/modules/support/view/ContentSupport.html',
        controller: 'SupportContentCtrl'
    })
    .state(STATE_VALID_OPENID, {
    	url: '/openid/valid?openid.ns&openid.mode&openid.op_endpoint&openid.claimed_id&openid.identity&openid.return_to&openid.response_nonce&openid.assoc_handle&openid.signed&openid.sig',
        controller: 'ValidateLoginCtrl'
    });
    
    $urlRouterProvider.otherwise('/buy');
});

app.run(function(AuthService) {
	//check auth token in cookies.
	if(!jQuery.isEmptyObject(AuthService.getAuthToken()))
	{
	   AuthService.updateUserDetails();
	}

});


