import { H160, H256 } from "codechain-primitives";
import { Transaction } from "../Transaction";
import { NetworkId } from "../types";
import { AssetMintOutput } from "./AssetMintOutput";
export declare class IncreaseAssetSupply extends Transaction {
    private readonly transaction;
    private readonly approvals;
    constructor(params: {
        networkId: NetworkId;
        shardId: number;
        assetType: H160;
        output: AssetMintOutput;
        approvals: string[];
    });
    tracker(): H256;
    type(): string;
    protected actionToEncodeObject(): any[];
    protected actionToJSON(): any;
}
