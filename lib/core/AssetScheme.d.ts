import { AssetTransferAddress, H256, PlatformAddress } from "codechain-primitives";
import { AssetMintTransaction } from "./transaction/AssetMintTransaction";
import { NetworkId } from "./types";
/**
 * Object that contains information about the Asset when performing AssetMintTransaction.
 */
export declare class AssetScheme {
    static fromJSON(data: any): AssetScheme;
    readonly networkId?: NetworkId;
    readonly shardId?: number;
    readonly worldId?: number;
    readonly metadata: string;
    readonly amount: number;
    readonly registrar: PlatformAddress | null;
    readonly pool: {
        assetType: H256;
        amount: number;
    }[];
    constructor(data: {
        networkId?: NetworkId;
        shardId?: number;
        worldId?: number;
        metadata: string;
        amount: number;
        registrar: PlatformAddress | null;
        pool: {
            assetType: H256;
            amount: number;
        }[];
    });
    toJSON(): {
        metadata: string;
        amount: number;
        registrar: string | null;
        pool: {
            assetType: string;
            amount: number;
        }[];
    };
    createMintTransaction(params: {
        recipient: AssetTransferAddress | string;
        nonce?: number;
    }): AssetMintTransaction;
}
