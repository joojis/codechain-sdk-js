/// <reference types="node" />
import { AssetTransferAddress, H160 } from "codechain-primitives/lib";
export declare class AssetMintOutput {
    /**
     * Create an AssetMintOutput from an AssetMintOutput JSON object.
     * @param data An AssetMintOutput JSON object.
     * @returns An AssetMintOutput.
     */
    static fromJSON(data: {
        lockScriptHash: string;
        parameters: Buffer[];
        amount: number | null;
    }): AssetMintOutput;
    readonly lockScriptHash: H160;
    readonly parameters: Buffer[];
    readonly amount: number | null;
    /**
     * @param data.lockScriptHash A lock script hash of the output.
     * @param data.parameters Parameters of the output.
     * @param data.amount Asset amount of the output.
     */
    constructor(data: {
        lockScriptHash: H160;
        parameters: Buffer[];
        amount: number | null;
    } | {
        recipient: AssetTransferAddress;
        amount: number | null;
    });
    /**
     * Convert to an AssetMintOutput JSON object.
     * @returns An AssetMintOutput JSON object.
     */
    toJSON(): {
        lockScriptHash: string;
        parameters: number[][];
        amount: number | null;
    };
}
