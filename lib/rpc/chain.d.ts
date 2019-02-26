import { H160, H256, H512, PlatformAddress, U64 } from "codechain-primitives";
import { Rpc } from ".";
import { Asset } from "../core/Asset";
import { AssetScheme } from "../core/AssetScheme";
import { Block } from "../core/Block";
import { SignedTransaction } from "../core/SignedTransaction";
import { Text } from "../core/Text";
import { Transaction } from "../core/Transaction";
import { NetworkId } from "../core/types";
export declare class ChainRpc {
    private rpc;
    private transactionSigner?;
    private transactionFee?;
    /**
     * @hidden
     */
    constructor(rpc: Rpc, options: {
        transactionSigner?: string;
        transactionFee?: number;
    });
    /**
     * Sends SignedTransaction to CodeChain's network.
     * @param tx SignedTransaction
     * @returns SignedTransaction's hash.
     */
    sendSignedTransaction(tx: SignedTransaction): Promise<H256>;
    /**
     * Signs a tx with the given account and sends it to CodeChain's network.
     * @param tx The tx to send
     * @param options.account The account to sign the tx
     * @param options.passphrase The account's passphrase
     * @param options.seq The seq of the tx
     * @param options.fee The fee of the tx
     * @returns SignedTransaction's hash
     * @throws When the given account cannot afford to pay the fee
     * @throws When the given fee is too low
     * @throws When the given seq does not match
     * @throws When the given account is unknown
     * @throws When the given passphrase does not match
     */
    sendTransaction(tx: Transaction, options?: {
        account?: PlatformAddress | string;
        passphrase?: string;
        seq?: number | null;
        fee?: U64 | string | number;
    }): Promise<H256>;
    /**
     * Gets SignedTransaction of given hash. Else returns null.
     * @param hash SignedTransaction's hash
     * @returns SignedTransaction, or null when SignedTransaction was not found.
     */
    getTransaction(hash: H256 | string): Promise<SignedTransaction | null>;
    /**
     * Gets the transaction result of given tx.
     * @param hash The tx hash of which to get the corresponding tx of.
     * @param options.timeout Indicating milliseconds to wait the tx to be confirmed.
     * @returns boolean, or null when transaction of given hash not exists.
     */
    getTransactionResult(hash: H256 | string, options?: {
        timeout?: number;
    }): Promise<boolean | null>;
    /**
     * Gets the regular key of an account of given address, recorded in the block of given blockNumber. If blockNumber is not given, then returns the regular key in the most recent block.
     * @param address An account address
     * @param blockNumber The specific block number to get account's regular key at given address.
     * @returns The regular key of account at specified block.
     */
    getRegularKey(address: PlatformAddress | string, blockNumber?: number): Promise<H512 | null>;
    /**
     * Gets the owner of a regular key, recorded in the block of given blockNumber.
     * @param regularKey A regular key.
     * @param blockNumber A block number.
     * @return The platform address that can use the regular key at the specified block.
     */
    getRegularKeyOwner(regularKey: H512 | string, blockNumber?: number): Promise<PlatformAddress | null>;
    /**
     * Gets the shard id of the given hash of a CreateShard transaction.
     * @param hash A transaction hash of a CreateShard transaction.
     * @param blockNumber A block number.
     * @returns A shard id.
     */
    getShardIdByHash(hash: H256 | string, blockNumber?: number): Promise<number | null>;
    /**
     * Gets the owners of the shard.
     * @param shardId A shard id.
     * @returns The platform addresses of the owners.
     */
    getShardOwners(shardId: number, blockNumber?: number): Promise<PlatformAddress[] | null>;
    /**
     * Gets the users of the shard.
     * @param shardId A shard id.
     * @returns The platform addresses of the users.
     */
    getShardUsers(shardId: number, blockNumber?: number): Promise<PlatformAddress[] | null>;
    /**
     * Gets a transaction of given hash.
     * @param tracker The tracker of which to get the corresponding transaction of.
     * @returns A transaction, or null when transaction of given hash not exists.
     */
    getTransactionByTracker(tracker: H256 | string): Promise<SignedTransaction | null>;
    /**
     * Gets results of a transaction of given tracker.
     * @param tracker The transaction hash of which to get the corresponding transaction of.
     * @param options.timeout Indicating milliseconds to wait the transaction to be confirmed.
     * @returns List of boolean, or null when transaction of given hash not exists.
     */
    getTransactionResultsByTracker(tracker: H256 | string, options?: {
        timeout?: number;
    }): Promise<boolean[]>;
    /**
     * Gets balance of an account of given address, recorded in the block of given blockNumber. If blockNumber is not given, then returns balance recorded in the most recent block.
     * @param address An account address
     * @param blockNumber The specific block number to get account's balance at given address.
     * @returns Balance of account at the specified block, or null if no such block exists.
     */
    getBalance(address: PlatformAddress | string, blockNumber?: number): Promise<U64>;
    /**
     * Gets a hint to find out why the transaction failed.
     * @param transactionHash A transaction hash from which the error hint would get.
     * @returns Null if the transaction is not involved in the chain or succeeded. If the transaction failed, this should return the reason for the transaction failing.
     */
    getErrorHint(transactionHash: H256 | string): Promise<string | null>;
    /**
     * Gets seq of an account of given address, recorded in the block of given blockNumber. If blockNumber is not given, then returns seq recorded in the most recent block.
     * @param address An account address
     * @param blockNumber The specific block number to get account's seq at given address.
     * @returns Seq of account at the specified block, or null if no such block exists.
     */
    getSeq(address: PlatformAddress | string, blockNumber?: number): Promise<number>;
    /**
     * Gets number of the latest block.
     * @returns Number of the latest block.
     */
    getBestBlockNumber(): Promise<number>;
    /**
     * Gets block hash of given blockNumber.
     * @param blockNumber The block number of which to get the block hash of.
     * @returns BlockHash, if block exists. Else, returns null.
     */
    getBlockHash(blockNumber: number): Promise<H256 | null>;
    /**
     * Gets block of given block hash.
     * @param hashOrNumber The block hash or number of which to get the block of
     * @returns Block, if block exists. Else, returns null.
     */
    getBlock(hashOrNumber: H256 | string | number): Promise<Block | null>;
    /**
     * Gets asset scheme of given tracker of the mint transaction.
     * @param tracker The tracker of the mint transaction.
     * @param shardId The shard id of Asset Scheme.
     * @param blockNumber The specific block number to get the asset scheme from
     * @returns AssetScheme, if asset scheme exists. Else, returns null.
     */
    getAssetSchemeByTracker(tracker: H256 | string, shardId: number, blockNumber?: number | null): Promise<AssetScheme | null>;
    /**
     * Gets asset scheme of asset type
     * @param assetType The type of Asset.
     * @param shardId The shard id of Asset Scheme.
     * @param blockNumber The specific block number to get the asset scheme from
     * @returns AssetScheme, if asset scheme exists. Else, returns null.
     */
    getAssetSchemeByType(assetType: H160 | string, shardId: number, blockNumber?: number | null): Promise<AssetScheme | null>;
    /**
     * Gets asset of given transaction hash and index.
     * @param tracker The tracker of previous input transaction.
     * @param index The index of output in the transaction.
     * @param shardId The shard id of output in the transaction.
     * @param blockNumber The specific block number to get the asset from
     * @returns Asset, if asset exists, Else, returns null.
     */
    getAsset(tracker: H256 | string, index: number, shardId: number, blockNumber?: number): Promise<Asset | null>;
    /**
     * Gets the text of the given hash of tx with Store type.
     * @param txHash The tx hash of the Store tx.
     * @param blockNumber The specific block number to get the text from
     * @returns Text, if text exists. Else, returns null.
     */
    getText(txHash: H256 | string, blockNumber?: number | null): Promise<Text | null>;
    /**
     * Checks whether an asset is spent or not.
     * @param txhash The tx hash of AssetMintTransaction or AssetTransferTransaction.
     * @param index The index of output in the transaction.
     * @param shardId The shard id of an Asset.
     * @param blockNumber The specific block number to get the asset from.
     * @returns True, if the asset is spent. False, if the asset is not spent. Null, if no such asset exists.
     */
    isAssetSpent(txhash: H256 | string, index: number, shardId: number, blockNumber?: number): Promise<boolean | null>;
    /**
     * Gets pending transactions.
     * @returns List of SignedTransaction, with each tx has null for blockNumber/blockHash/transactionIndex.
     */
    getPendingTransactions(): Promise<SignedTransaction[]>;
    /**
     * Gets the network ID of the node.
     * @returns A network ID, e.g. "tc".
     */
    getNetworkId(): Promise<NetworkId>;
}
