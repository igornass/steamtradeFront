//REST API properties
var STEAM_COMMUNITY_URL = 'https://steamcommunity-a.akamaihd.net/';
var STEAM_TRADE_REST_WS_URL = 'http://api.steamtrade.net/';
var OPEN_ID_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'openid/';
var LOGIN_REST_WS_URL = OPEN_ID_REST_WS_URL + 'login';
var VALID_OPENID_REST_WS_URL = OPEN_ID_REST_WS_URL + 'valid';
var USERS_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'users/';
var OFFERS_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'offers/';
var ITEMS_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'items/';
var BUY_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'buy/';
var TRADES_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'trades/';
var FAILED_TRADES_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'failed/';
var SUCCESSFUL_TRADES_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'successful/';
var OPERATIONS_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'operations/';
var CASH_REST_WS_URL = STEAM_TRADE_REST_WS_URL + 'cash/';
var CASH_IN_REST_WS_URL = CASH_REST_WS_URL + 'in/';

var CURRENT_USER_PROFILE_REST_WS_URL = USERS_REST_WS_URL + 'me/';
var CURRENT_USER_TRADELINK_REST_WS_URL = CURRENT_USER_PROFILE_REST_WS_URL + 'link/';
var CURRENT_USER_TRADING_REST_WS_URL = CURRENT_USER_PROFILE_REST_WS_URL + 'trading/';
var CURRENT_USER_INVENTORY_REST_WS_URL = CURRENT_USER_PROFILE_REST_WS_URL + 'inventory/';
var CURRENT_USER_PENDING_SALES_WS_URL = OFFERS_REST_WS_URL + 'my';
var CHECK_TRADES_WS_URL = TRADES_REST_WS_URL + 'check/';

var AUTH_TOKEN = 'authToken';
var TMP_AUTH_TOKEN = 'tmpAuthToken';
var SELECTED_ITEMS_HISTORY = 'selectedItemsHistory';
var CACHED_OFFERS = 'cachedOffers';

//Game titles
var GAMES = {};
	GAMES[570] = 'Dota 2';
	GAMES[730] = 'Counter Strike: Global Offensive';
	GAMES[440] = 'Team Fortress 2';

//States
var STATE_BUY = 'buy_state';
var STATE_BUY_ITEM = 'buy_item_state';
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
var PAGES = {};
	PAGES[STATE_BUY] = 'Купить';
	PAGES[STATE_BUY_ITEM] = 'Купить',
	PAGES[STATE_SELL] = 'Продать',
	PAGES[STATE_LOTS] = 'Лоты',
	PAGES[STATE_EXCHANGE] = 'Обмены',
	PAGES[STATE_BALANCE] = 'Баланс',
	PAGES[STATE_SETTINGS] = 'Настройки',
	PAGES[STATE_AGREEMENT] = 'Пользовательское соглашение',
	PAGES[STATE_CONTRACT] = 'Агентский договор',
	PAGES[STATE_CONTACTS] = 'Контакты',
	PAGES[STATE_SUPPORT] = 'Поддержка'