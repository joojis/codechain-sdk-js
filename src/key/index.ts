import { AssetTransferAddress, PlatformAddress } from "codechain-primitives";

import {
    AssetTransferTransaction,
    Parcel,
    SignedParcel,
    U256
} from "../core/classes";
import { NetworkId } from "../core/types";

import { KeyStore } from "./KeyStore";
import { LocalKeyStore } from "./LocalKeyStore";
import { MemoryKeyStore } from "./MemoryKeyStore";
import { P2PKH } from "./P2PKH";
import { P2PKHBurn } from "./P2PKHBurn";
import { RemoteKeyStore } from "./RemoteKeyStore";

export type KeyStoreType =
    | "local"
    | "memory"
    | { type: "remote"; url: string }
    | { type: "local"; path: string };

export class Key {
    public static classes = {
        RemoteKeyStore,
        LocalKeyStore
    };

    public classes = Key.classes;
    private networkId: NetworkId;
    private keyStore: KeyStore | null;
    private keyStoreType: KeyStoreType;

    constructor(options: { networkId: NetworkId; keyStoreType: KeyStoreType }) {
        const { networkId, keyStoreType } = options;
        if (!isKeyStoreType(keyStoreType)) {
            throw Error(`Unexpected keyStoreType param: ${keyStoreType}`);
        }
        this.networkId = networkId;
        this.keyStore = null;
        this.keyStoreType = keyStoreType;
    }

    /**
     * Creates persistent key store
     * @param keystoreURL key store url (ex http://localhost:7007)
     */
    public createRemoteKeyStore(keystoreURL: string): Promise<KeyStore> {
        return RemoteKeyStore.create(keystoreURL);
    }

    /**
     * Creates persistent key store which stores data in the filesystem.
     * @param dbPath A keystore file path
     */
    public createLocalKeyStore(dbPath?: string): Promise<KeyStore> {
        return LocalKeyStore.create({ dbPath });
    }

    /**
     * Creates a new platform address
     * @param params.keyStore A key store.
     * @returns A new platform address
     */
    public async createPlatformAddress(
        params: {
            keyStore?: KeyStore;
            passphrase?: string;
        } = {}
    ): Promise<PlatformAddress> {
        const { keyStore = await this.ensureKeyStore(), passphrase } = params;
        if (!isKeyStore(keyStore)) {
            throw Error(
                `Expected keyStore param to be a KeyStore instance but found ${keyStore}`
            );
        }
        const accountId = await keyStore.platform.createKey({ passphrase });
        const { networkId } = this;
        return PlatformAddress.fromAccountId(accountId, { networkId });
    }

    /**
     * Creates a new asset transfer address
     * @param params.type The type of AssetTransferAddress. The default value is "P2PKH".
     * @param params.keyStore A key store.
     * @returns A new platform address
     */
    public async createAssetTransferAddress(
        params: {
            type?: "P2PKH" | "P2PKHBurn";
            keyStore?: KeyStore;
            passphrase?: string;
        } = {}
    ): Promise<AssetTransferAddress> {
        const {
            keyStore = await this.ensureKeyStore(),
            type = "P2PKH",
            passphrase
        } = params;
        if (!isKeyStore(keyStore)) {
            throw Error(
                `Expected keyStore param to be a KeyStore instance but found ${keyStore}`
            );
        }
        const { networkId } = this;
        if (type === "P2PKH") {
            const p2pkh = new P2PKH({ keyStore, networkId });
            return p2pkh.createAddress({ passphrase });
        } else if (type === "P2PKHBurn") {
            const p2pkhBurn = new P2PKHBurn({ keyStore, networkId });
            return p2pkhBurn.createAddress({ passphrase });
        } else {
            throw Error(
                `Expected the type param of createAssetTransferAddress to be either P2PKH or P2PKHBurn but found ${type}`
            );
        }
    }

    /**
     * Creates P2PKH script generator.
     * @returns new instance of P2PKH
     */
    public createP2PKH(params: { keyStore: KeyStore }): P2PKH {
        const { keyStore } = params;
        if (!isKeyStore(keyStore)) {
            throw Error(
                `Expected keyStore param to be a KeyStore instance but found ${keyStore}`
            );
        }
        const { networkId } = this;
        return new P2PKH({ keyStore, networkId });
    }

    /**
     * Creates P2PKHBurn script generator.
     * @returns new instance of P2PKHBurn
     */
    public createP2PKHBurn(params: { keyStore: KeyStore }): P2PKHBurn {
        const { keyStore } = params;
        if (!isKeyStore(keyStore)) {
            throw Error(
                `Expected keyStore param to be a KeyStore instance but found ${keyStore}`
            );
        }
        const { networkId } = this;
        return new P2PKHBurn({ keyStore, networkId });
    }

    /**
     * Signs a Parcel with the given account.
     * @param parcel A Parcel
     * @param params.keyStore A key store.
     * @param params.account An account.
     * @param params.passphrase The passphrase for the given account
     * @returns A SignedParcel
     * @throws When nonce or fee in the Parcel is null
     * @throws When account or its passphrase is invalid
     */
    public async signParcel(
        parcel: Parcel,
        params: {
            keyStore?: KeyStore;
            account: PlatformAddress | string;
            passphrase?: string;
            fee: U256 | string | number;
            nonce: U256 | string | number;
        }
    ): Promise<SignedParcel> {
        if (!(parcel instanceof Parcel)) {
            throw Error(
                `Expected the first argument of signParcel to be a Parcel instance but found ${parcel}`
            );
        }
        const {
            account,
            passphrase,
            keyStore = await this.ensureKeyStore(),
            fee,
            nonce
        } = params;
        if (!isKeyStore(keyStore)) {
            throw Error(
                `Expected keyStore param to be a KeyStore instance but found ${keyStore}`
            );
        }
        if (!PlatformAddress.check(account)) {
            throw Error(
                `Expected account param to be a PlatformAddress value but found ${account}`
            );
        }
        parcel.setFee(fee);
        parcel.setNonce(nonce);
        const accountId = PlatformAddress.ensure(account).getAccountId();
        const sig = await keyStore.platform.sign({
            key: accountId.value,
            message: parcel.hash().value,
            passphrase
        });
        return new SignedParcel(parcel, sig);
    }

    /**
     * Signs a transaction's input with a given key store.
     * @param tx An AssetTransferTransaction.
     * @param index The index of an input to sign.
     * @param params.keyStore A key store.
     * @param params.passphrase The passphrase for the given input.
     */
    public async signTransactionInput(
        tx: AssetTransferTransaction,
        index: number,
        params: {
            keyStore?: KeyStore;
            passphrase?: string;
        } = {}
    ): Promise<void> {
        if (index >= tx.inputs.length) {
            throw Error(`Invalid index`);
        }
        const { lockScriptHash, parameters } = tx.inputs[index].prevOut;
        if (lockScriptHash === undefined || parameters === undefined) {
            throw Error(`Invalid transaction input`);
        }
        if (lockScriptHash.value !== P2PKH.getLockScriptHash().value) {
            throw Error(`Unexpected lock script hash`);
        }
        if (parameters.length !== 1) {
            throw Error(`Unexpected length of parameters`);
        }
        const publicKeyHash = Buffer.from(parameters[0]).toString("hex");

        tx.inputs[index].setLockScript(P2PKH.getLockScript());
        const { keyStore = await this.ensureKeyStore(), passphrase } = params;
        const p2pkh = this.createP2PKH({ keyStore });
        tx.inputs[index].setUnlockScript(
            await p2pkh.createUnlockScript(
                publicKeyHash,
                tx.hashWithoutScript(),
                {
                    passphrase
                }
            )
        );
    }

    /**
     * Signs a transaction's burn with a given key store.
     * @param tx An AssetTransferTransaction.
     * @param index The index of a burn to sign.
     * @param params.keyStore A key store.
     * @param params.passphrase The passphrase for the given burn.
     */
    public async signTransactionBurn(
        tx: AssetTransferTransaction,
        index: number,
        params: {
            keyStore?: KeyStore;
            passphrase?: string;
        } = {}
    ): Promise<void> {
        if (index >= tx.burns.length) {
            throw Error(`Invalid index`);
        }
        const { lockScriptHash, parameters } = tx.burns[index].prevOut;
        if (lockScriptHash === undefined || parameters === undefined) {
            throw Error(`Invalid transaction burn`);
        }
        if (lockScriptHash.value !== P2PKHBurn.getLockScriptHash().value) {
            throw Error(`Unexpected lock script hash`);
        }
        if (parameters.length !== 1) {
            throw Error(`Unexpected length of parameters`);
        }
        const publicKeyHash = Buffer.from(parameters[0]).toString("hex");

        tx.burns[index].setLockScript(P2PKHBurn.getLockScript());
        const { keyStore = await this.ensureKeyStore(), passphrase } = params;
        const p2pkhBurn = this.createP2PKHBurn({ keyStore });
        tx.burns[index].setUnlockScript(
            await p2pkhBurn.createUnlockScript(
                publicKeyHash,
                tx.hashWithoutScript(),
                {
                    passphrase
                }
            )
        );
    }

    private async ensureKeyStore(): Promise<KeyStore> {
        if (this.keyStore === null) {
            if (this.keyStoreType === "local") {
                this.keyStore = await LocalKeyStore.create();
            } else if (this.keyStoreType === "memory") {
                this.keyStore = await LocalKeyStore.createForTest();
            } else if (this.keyStoreType.type === "local") {
                this.keyStore = await LocalKeyStore.create({
                    dbPath: this.keyStoreType.path
                });
            } else if (this.keyStoreType.type === "remote") {
                this.keyStore = await RemoteKeyStore.create(
                    this.keyStoreType.url
                );
            } else {
                throw Error(`Unreachable`);
            }
        }
        return this.keyStore;
    }
}

function isKeyStore(value: any) {
    return (
        value instanceof LocalKeyStore ||
        value instanceof RemoteKeyStore ||
        value instanceof MemoryKeyStore
    );
}

function isKeyStoreType(value: any) {
    if (typeof value === "string") {
        return value === "local" || value === "memory";
    }
    if (typeof value === "object" && value !== null) {
        return (
            (value.type === "local" && typeof value.path === "string") ||
            (value.type === "remote" && typeof value.url === "string")
        );
    }
    return false;
}
