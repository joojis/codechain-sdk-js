import { AssetMintTransaction } from "./AssetMintTransaction";
import { AssetTransferTransaction } from "./AssetTransferTransaction";
import { CreateWorldTransaction } from "./CreateWorldTransaction";
import { SetWorldOwnersTransaction } from "./SetWorldOwnersTransaction";
import { SetWorldUsersTransaction } from "./SetWorldUsersTransaction";

export type Transaction =
    | CreateWorldTransaction
    | SetWorldOwnersTransaction
    | SetWorldUsersTransaction
    | AssetMintTransaction
    | AssetTransferTransaction;

/**
 * Create a transaction from either an AssetMintTransaction JSON object or an
 * AssetTransferTransaction JSON object.
 * @param params Either an AssetMintTransaction JSON object or an AssetTransferTransaction JSON object.
 * @returns A Transaction.
 */
export const getTransactionFromJSON = (params: {
    type: string;
    data: object;
}) => {
    const { type } = params;
    switch (type) {
        case "createWorld":
            return CreateWorldTransaction.fromJSON(params);
        case "setWorldOwners":
            return SetWorldOwnersTransaction.fromJSON(params);
        case "setWorldUsers":
            return SetWorldUsersTransaction.fromJSON(params);
        case "assetMint":
            return AssetMintTransaction.fromJSON(params);
        case "assetTransfer":
            return AssetTransferTransaction.fromJSON(params);
        default:
            throw Error(`Unexpected transaction type: ${type}`);
    }
};
