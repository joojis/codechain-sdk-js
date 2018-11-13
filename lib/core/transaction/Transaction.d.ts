import { AssetComposeTransaction, AssetComposeTransactionJSON } from "./AssetComposeTransaction";
import { AssetDecomposeTransaction, AssetDecomposeTransactionJSON } from "./AssetDecomposeTransaction";
import { AssetMintTransaction, AssetMintTransactionJSON } from "./AssetMintTransaction";
import { AssetTransferTransaction, AssetTransferTransactionJSON } from "./AssetTransferTransaction";
export declare type TransactionJSON = AssetMintTransactionJSON | AssetTransferTransactionJSON | AssetComposeTransactionJSON | AssetDecomposeTransactionJSON;
export declare type Transaction = AssetMintTransaction | AssetTransferTransaction | AssetComposeTransaction | AssetDecomposeTransaction;
/**
 * Create a transaction from either an AssetMintTransaction JSON object or an
 * AssetTransferTransaction JSON object.
 * @param params Either an AssetMintTransaction JSON object or an AssetTransferTransaction JSON object.
 * @returns A Transaction.
 */
export declare const getTransactionFromJSON: (json: TransactionJSON) => Transaction;
