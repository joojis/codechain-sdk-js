import fetch from "node-fetch";

import { AccountRpc } from "./account";
import { ChainRpc } from "./chain";
import { DevelRpc } from "./devel";
import { NetworkRpc } from "./network";
import { NodeRpc } from "./node";

/**
 * @hidden
 */
const jaysonBrowserClient = require("jayson/lib/client/browser");

export class Rpc {
    /**
     * RPC module for retrieving the node info.
     */
    public node: NodeRpc;
    /**
     * RPC module for accessing the blockchain.
     */
    public chain: ChainRpc;
    /**
     * RPC module for configuring P2P networking of the node.
     */
    public network: NetworkRpc;
    /**
     * RPC module for account management and signing
     */
    public account: AccountRpc;

    public devel: DevelRpc;
    private client: any;

    /**
     * @param params.server HTTP RPC server address.
     * @param params.options.parcelSigner The default account to sign the parcel
     * @param params.options.parcelFee The default amount for the parcel fee
     */
    constructor(params: {
        server: string;
        options?: {
            parcelSigner?: string;
            parcelFee?: number;
        };
    }) {
        const { server, options = {} } = params;
        this.client = jaysonBrowserClient((request: any, callback: any) => {
            fetch(server, {
                method: "POST",
                body: request,
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(res => {
                    return res.text();
                })
                .then(text => {
                    return callback(null, text);
                })
                .catch(err => {
                    return callback(err);
                });
        });

        this.node = new NodeRpc(this);
        this.chain = new ChainRpc(this, options);
        this.network = new NetworkRpc(this);
        this.account = new AccountRpc(this);
        this.devel = new DevelRpc(this);
    }

    public sendRpcRequest = (name: string, params: any[]) => {
        return new Promise<any>((resolve, reject) => {
            this.client.request(name, params, (err: any, res: any) => {
                if (err) {
                    return reject(
                        Error(`An error occurred while ${name}: ${err}`)
                    );
                } else if (res.error) {
                    // FIXME: Throw Error with a description
                    return reject(res.error);
                }
                resolve(res.result);
            });
        });
    };
}
