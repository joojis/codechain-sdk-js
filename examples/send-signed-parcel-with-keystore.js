var SDK = require("..");

var SERVER_URL = process.env.CODECHAIN_RPC_HTTP || "http://localhost:8080";
var sdk = new SDK({
    server: SERVER_URL
});

var parcel = sdk.core.createPaymentParcel({
    recipient: "tccqruq09sfgax77nj4gukjcuq69uzeyv0jcs7vzngg",
    amount: 10000
});

(async () => {
    const keyStore = await sdk.key.createLocalKeyStore();
    const account = await sdk.key.createPlatformAddress({
        keyStore
    });
    const nonce = await sdk.rpc.chain.getNonce(account);

    const signedParcel = await sdk.key.signParcel(parcel, {
        account,
        keyStore,
        fee: 10,
        nonce
    });
    console.log(signedParcel);
    // FIXME: needs fee
    // const parcelHash = await sdk.rpc.chain.sendSignedParcel(signedParcel);
})();
