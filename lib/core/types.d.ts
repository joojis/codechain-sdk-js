import { AssetTransferAddress, H256 } from "codechain-primitives/lib";
import { AssetTransferOutput } from "./transaction/AssetTransferOutput";
export declare type NetworkId = string;
export declare type AssetTransferOutputValue = AssetTransferOutput | {
    amount: number;
    assetType: H256 | string;
    recipient: AssetTransferAddress | string;
};
