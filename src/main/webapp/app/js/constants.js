//REST API properties
var STEAM_COMMUNITY_URL = 'https://steamcommunity-a.akamaihd.net/';
var STEAM_TRADE_REST_WS_URL = 'http://api.steamtrade.net/';
var OPEN_ID_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'openid/';
var LOGIN_REST_WS_URL = OPEN_ID_REST_WS_URL + 'login';
var VALID_OPENID_REST_WS_URL = OPEN_ID_REST_WS_URL + 'valid';
var USERS_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'users/';
var OFFERS_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'offers/';
var BUY_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'buy/';
var TRADES_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'trades/';
var FAILED_TRADES_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'failed/';
var SUCCESSFUL_TRADES_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'successful/';

var CURRENT_USER_PROFILE_REST_WS_URL = USERS_REST_WS_URL + 'me/';
var CURRENT_USER_INVENTORY_REST_WS_URL = CURRENT_USER_PROFILE_REST_WS_URL + 'inventory/';
var CURRENT_USER_PENDING_SALES_WS_URL = OFFERS_REST_WS_URL + 'my';

var AUTH_TOKEN = 'authToken';
var TMP_AUTH_TOKEN = 'tmpAuthToken';

//States
var STATE_BUY = 'buy_state';
var STATE_SELL = 'sell_state';
var STATE_LOTS = 'lots_state';
var STATE_EXCHANGE = 'exchange_state';
var STATE_BALANCE = 'balance_state';
var STATE_SETTINGS = 'settings_state';
var STATE_AGREEMENT = 'agreement_state';
var STATE_CONTRACT = 'contract_state';
var STATE_CONTACTS = 'contacts_state';
var STATE_SUPPORT = 'support_state';
var STATE_VALID_OPENID = 'openid_valid';

//Page titles
var PAGES = {
		'buy_state': 'Купить',
		'sell_state': 'Продать',
		'lots_state': 'Лоты',
		'exchange_state': 'Обмены',
		'balance_state': 'Баланс',
		'settings_state': 'Настройки',
		'agreement_state': 'Пользовательское соглашение',
		'contract_state': 'Агентский договор',
		'contacts_state': 'Контакты',
		'support_state': 'Поддержка'
}