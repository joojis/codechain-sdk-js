import { AssetTransferAddressValue, H160Value, U64Value } from "codechain-primitives";
import { AssetTransferOutput } from "./transaction/AssetTransferOutput";
export declare type NetworkId = string;
export declare type AssetTransferOutputValue = AssetTransferOutput | {
    quantity: U64Value;
    assetType: H160Value;
    shardId: number;
    recipient: AssetTransferAddressValue;
};
