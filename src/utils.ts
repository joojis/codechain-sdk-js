import {
    blake256 as _blake256,
    blake256WithKey as _blake256WithKey,
    generatePrivateKey as _generatePrivateKey,
    getAccountIdFromPrivate as _getAccountIdFromPrivate,
    getAccountIdFromPublic as _getAccountIdFromPublic,
    getPublicFromPrivate as _getPublicFromPrivate,
    recoverEcdsa as _recoverEcdsa,
    ripemd160 as _ripemd160,
    signEcdsa as _signEcdsa,
    toHex as _toHex,
    verifyEcdsa as _verifyEcdsa
} from "codechain-primitives";

/**
 * Converts buffer to hexadecimal string.
 * @param buffer arbritrary length of data
 * @returns hexadecimal string
 */
export const toHex = (buffer: Buffer): string => _toHex(buffer);

/**
 * Gets data's 256 bit blake hash.
 * @param data buffer or hexadecimal string
 * @returns 32 byte hexadecimal string
 */
export const blake256 = (data: Buffer | string): string => _blake256(data);

/**
 * Gets data's 256 bit blake hash by using the key.
 * @param data buffer or hexadecimal string
 * @param key
 * @returns 32 byte hexadecimal string
 */
export const blake256WithKey = (
    data: Buffer | string,
    key: Uint8Array
): string => _blake256WithKey(data, key);

/**
 * Gets data's 160 bit RIPEMD hash.
 * @param data buffer or hexadecimal string
 * @returns 20 byte hexadecimal string
 */
export const ripemd160 = (data: Buffer | string): string => _ripemd160(data);

export interface EcdsaSignature {
    r: string;
    s: string;
    v: number;
}

/**
 * Gets signature for message from private key.
 * @param message arbitrary length string
 * @param priv 32 byte hexadecimal string of private key
 * @returns r, s, v of ECDSA signature
 */
export const signEcdsa = (message: string, priv: string): EcdsaSignature =>
    _signEcdsa(message, priv);

/**
 * Checks if the signature from signEcdsa is correct.
 * @param message arbitrary length string
 * @param signature r, s, v of ECDSA signature
 * @param pub 64 byte hexadecimal string of public key
 * @returns if signature is valid, true. Else false.
 */
export const verifyEcdsa = (
    message: string,
    signature: EcdsaSignature,
    pub: string
): boolean => _verifyEcdsa(message, signature, pub);

/**
 * Gets public key from the message and signature.
 * @param message arbitrary length string
 * @param signature r, s, v of ECDSA signature
 * @returns 64 byte hexadecimal string public key
 */
export const recoverEcdsa = (
    message: string,
    signature: EcdsaSignature
): string => _recoverEcdsa(message, signature);

/**
 * Generates a private key.
 * @returns 32 byte hexadecimal string of private key
 */
export const generatePrivateKey = (): string => _generatePrivateKey();

/**
 * Gets account id from private key.
 * @param priv 32 byte hexadecimal string of private key
 * @returns 20 byte hexadecimal string of account id
 */
export const getAccountIdFromPrivate = (priv: string): string =>
    _getAccountIdFromPrivate(priv);

/**
 * Gets account id from the given public key.
 * @param publicKey 64 byte hexadecimal string of uncompressed public key
 * @returns 20 byte hexadecimal string of account id
 */
export const getAccountIdFromPublic = (publicKey: string): string =>
    _getAccountIdFromPublic(publicKey);

/**
 * Gets public key from private key.
 * @param priv 32 byte hexadecimal string of private key
 * @returns 64 byte hexadecimal string of public key
 */
export const getPublicFromPrivate = (priv: string): string =>
    _getPublicFromPrivate(priv);
