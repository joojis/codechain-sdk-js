var SDK = require("codechain-sdk");

var sdk = new SDK({
    server: process.env.CODECHAIN_RPC_HTTP || "http://localhost:8080",
    networkId: process.env.CODECHAIN_NETWORK_ID || "tc"
});

var ACCOUNT_ADDRESS =
    process.env.ACCOUNT_ADDRESS ||
    "tccqzn9jjm3j6qg69smd7cn0eup4w7z2yu9my9a2k78";

sdk.rpc.chain
    .getBalance(ACCOUNT_ADDRESS)
    .then(function(balance) {
        // the balance is a U256 instance at this moment.
        // Use toString() to print it out.
        console.log(balance.toString()); // the amount of CCC that the account has.
    })
    .catch(console.error);
