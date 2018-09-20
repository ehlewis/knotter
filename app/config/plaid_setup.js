var plaid = require('plaid');

global.PLAID_CLIENT_ID = '5ac8108bbdc6a40eb40cb093';
global.PLAID_SECRET = '786c67f3c3dd820f2bf7dd37ec5bb1';
global.PLAID_PUBLIC_KEY = '201d391154bbd55ef3725c4e6baed3';
global.PLAID_ENV = 'sandbox';

global.plaid_client = new plaid.Client(
    PLAID_CLIENT_ID,
    PLAID_SECRET,
    PLAID_PUBLIC_KEY,
    plaid.environments[PLAID_ENV]
);

module.exports = plaid_client;
