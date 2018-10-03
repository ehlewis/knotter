var plaid = require('plaid');

global.plaid_client = new plaid.Client(
    process.env.PLAID_CLIENT_ID,
    process.env.PLAID_SECRET,
    process.env.PLAID_PUBLIC_KEY,
    plaid.environments[process.env.PLAID_ENV]
);

module.exports = plaid_client;
