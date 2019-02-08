/// <reference types="node" />
import { H256, PlatformAddress, U256 } from "codechain-primitives";
import { SignedTransaction } from "./SignedTransaction";
export interface BlockData {
    parentHash: H256;
    timestamp: number;
    number: number;
    author: PlatformAddress;
    extraData: Buffer;
    transactionsRoot: H256;
    stateRoot: H256;
    invoicesRoot: H256;
    score: U256;
    seal: Buffer[];
    hash: H256;
    transactions: SignedTransaction[];
}
/**
 * Block is the unit of processes being handled by CodeChain. Contains information related to SignedTransaction's list and block creation.
 */
export declare class Block {
    static fromJSON(data: any): Block;
    parentHash: H256;
    timestamp: number;
    number: number;
    author: PlatformAddress;
    extraData: Buffer;
    transactionsRoot: H256;
    stateRoot: H256;
    invoicesRoot: H256;
    score: U256;
    seal: Buffer[];
    hash: H256;
    transactions: SignedTransaction[];
    constructor(data: BlockData);
    toJSON(): {
        parentHash: string;
        timestamp: number;
        number: number;
        author: string;
        extraData: Buffer;
        transactionsRoot: string;
        stateRoot: string;
        invoicesRoot: string;
        score: string;
        seal: Buffer[];
        hash: string;
        transactions: any[];
    };
}
