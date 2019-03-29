import { H256Value } from "codechain-primitives/lib";
import { Rpc } from ".";
import { SignedTransaction } from "../core/classes";
export declare class MempoolRpc {
    private rpc;
    /**
     * @hidden
     */
    constructor(rpc: Rpc);
    /**
     * Gets pending transactions that have the insertion timestamp within the given range.
     * @param from The lower bound of the insertion timestamp.
     * @param to The upper bound of the insertion timestamp.
     * @returns List of SignedTransaction, with each tx has null for blockNumber/blockHash/transactionIndex.
     */
    getPendingTransactions(from?: number | null, to?: number | null): Promise<{
        transactions: SignedTransaction[];
        lastTimestamp: number | null;
    }>;
    /**
     * Gets the count of the pending transactions within the given range from the transaction queues.
     * @param from The lower bound of collected pending transactions. If null, there is no lower bound.
     * @param to The upper bound of collected pending transactions. If null, there is no upper bound.
     * @returns The count of the pending transactions.
     */
    getPendingTransactionsCount(from?: number | null, to?: number | null): Promise<number>;
    /**
     * Gets a hint to find out why the transaction failed.
     * @param transactionHash A transaction hash from which the error hint would get.
     * @returns Null if the transaction is not involved in the chain or succeeded. If the transaction failed, this should return the reason for the transaction failing.
     */
    getErrorHint(transactionHash: H256Value): Promise<string | null>;
}
