import { Transaction } from "../transaction/Transaction";
export declare class AssetTransaction {
    transaction: Transaction;
    constructor(input: {
        transaction: Transaction;
    });
    toEncodeObject(): any[];
    toJSON(): {
        action: string;
        transaction: import("../transaction/Transaction").TransactionJSON;
    };
}
