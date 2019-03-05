"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var codechain_primitives_1 = require("codechain-primitives");
var Asset_1 = require("../core/Asset");
var AssetScheme_1 = require("../core/AssetScheme");
var Block_1 = require("../core/Block");
var SignedTransaction_1 = require("../core/SignedTransaction");
var Text_1 = require("../core/Text");
var Transaction_1 = require("../core/Transaction");
var json_1 = require("../core/transaction/json");
var ChainRpc = /** @class */ (function () {
    /**
     * @hidden
     */
    function ChainRpc(rpc, options) {
        var transactionSigner = options.transactionSigner, transactionFee = options.transactionFee;
        this.rpc = rpc;
        this.transactionSigner = transactionSigner;
        this.transactionFee = transactionFee;
    }
    /**
     * Sends SignedTransaction to CodeChain's network.
     * @param tx SignedTransaction
     * @returns SignedTransaction's hash.
     */
    ChainRpc.prototype.sendSignedTransaction = function (tx) {
        var _this = this;
        if (!(tx instanceof SignedTransaction_1.SignedTransaction)) {
            throw Error("Expected the first argument of sendSignedTransaction to be SignedTransaction but found " + tx);
        }
        return new Promise(function (resolve, reject) {
            var bytes = tx.rlpBytes().toString("hex");
            _this.rpc
                .sendRpcRequest("chain_sendSignedTransaction", ["0x" + bytes])
                .then(function (result) {
                try {
                    resolve(new codechain_primitives_1.H256(result));
                }
                catch (e) {
                    reject(Error("Expected sendSignedTransaction() to return a value of H256, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
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
    ChainRpc.prototype.sendTransaction = function (tx, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, account, passphrase, _c, fee, _d, seq, _e, address, sig;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!(tx instanceof Transaction_1.Transaction)) {
                            throw Error("Expected the first argument of sendTransaction to be a Transaction but found " + tx);
                        }
                        _a = options || { passphrase: undefined }, _b = _a.account, account = _b === void 0 ? this.transactionSigner : _b, passphrase = _a.passphrase, _c = _a.fee, fee = _c === void 0 ? this.transactionFee : _c;
                        if (!account) {
                            throw Error("The account to sign the tx is not specified");
                        }
                        else if (!codechain_primitives_1.PlatformAddress.check(account)) {
                            throw Error("Expected account param of sendTransaction to be a PlatformAddress value but found " + account);
                        }
                        _d = (options || {}).seq;
                        if (!(_d === void 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getSeq(account)];
                    case 1:
                        _e = _f.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _e = _d;
                        _f.label = 3;
                    case 3:
                        seq = _e;
                        tx.setSeq(seq);
                        if (!fee) {
                            throw Error("The fee of the tx is not specified");
                        }
                        tx.setFee(fee);
                        address = codechain_primitives_1.PlatformAddress.ensure(account);
                        return [4 /*yield*/, this.rpc.account.sign(tx.unsignedHash(), address, passphrase)];
                    case 4:
                        sig = _f.sent();
                        return [2 /*return*/, this.sendSignedTransaction(new SignedTransaction_1.SignedTransaction(tx, sig))];
                }
            });
        });
    };
    /**
     * Gets SignedTransaction of given hash. Else returns null.
     * @param hash SignedTransaction's hash
     * @returns SignedTransaction, or null when SignedTransaction was not found.
     */
    ChainRpc.prototype.getTransaction = function (hash) {
        var _this = this;
        if (!codechain_primitives_1.H256.check(hash)) {
            throw Error("Expected the first argument of getTransaction to be an H256 value but found " + hash);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getTransaction", [
                "0x" + codechain_primitives_1.H256.ensure(hash).value
            ])
                .then(function (result) {
                try {
                    resolve(result === null
                        ? null
                        : json_1.fromJSONToSignedTransaction(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getTransaction to return either null or JSON of SignedTransaction, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets the transaction result of given tx.
     * @param hash The tx hash of which to get the corresponding tx of.
     * @param options.timeout Indicating milliseconds to wait the tx to be confirmed.
     * @returns boolean, or null when transaction of given hash not exists.
     */
    ChainRpc.prototype.getTransactionResult = function (hash, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var attemptToGet, timeout, startTime, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!codechain_primitives_1.H256.check(hash)) {
                            throw Error("Expected the first argument of getTransactionResult to be an H256 value but found " + hash);
                        }
                        attemptToGet = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, this.rpc.sendRpcRequest("chain_getTransactionResult", [
                                        "0x" + codechain_primitives_1.H256.ensure(hash).value
                                    ])];
                            });
                        }); };
                        timeout = options.timeout;
                        if (timeout !== undefined &&
                            (typeof timeout !== "number" || timeout < 0)) {
                            throw Error("Expected timeout param of getTransactionResult to be non-negative number but found " + timeout);
                        }
                        startTime = Date.now();
                        return [4 /*yield*/, attemptToGet()];
                    case 1:
                        result = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(result === null &&
                            timeout !== undefined &&
                            Date.now() - startTime < timeout)) return [3 /*break*/, 5];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, attemptToGet()];
                    case 4:
                        result = _a.sent();
                        return [3 /*break*/, 2];
                    case 5:
                        if (result === null) {
                            return [2 /*return*/, null];
                        }
                        try {
                            return [2 /*return*/, JSON.parse(result)];
                        }
                        catch (e) {
                            throw Error("Expected chain_getTransactionResult to return either null or JSON of boolean, but an error occurred: " + e.toString());
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the regular key of an account of given address, recorded in the block of given blockNumber. If blockNumber is not given, then returns the regular key in the most recent block.
     * @param address An account address
     * @param blockNumber The specific block number to get account's regular key at given address.
     * @returns The regular key of account at specified block.
     */
    ChainRpc.prototype.getRegularKey = function (address, blockNumber) {
        var _this = this;
        if (!codechain_primitives_1.PlatformAddress.check(address)) {
            throw Error("Expected the first argument of getRegularKey to be a PlatformAddress value but found " + address);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the second argument of getRegularKey to be a number but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getRegularKey", [
                "" + codechain_primitives_1.PlatformAddress.ensure(address).value,
                blockNumber
            ])
                .then(function (result) {
                try {
                    resolve(result === null ? null : new codechain_primitives_1.H512(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getRegularKey to return either null or a value of H512, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets the owner of a regular key, recorded in the block of given blockNumber.
     * @param regularKey A regular key.
     * @param blockNumber A block number.
     * @return The platform address that can use the regular key at the specified block.
     */
    ChainRpc.prototype.getRegularKeyOwner = function (regularKey, blockNumber) {
        var _this = this;
        if (!codechain_primitives_1.H512.check(regularKey)) {
            throw Error("Expected the first argument of getRegularKeyOwner to be an H512 value but found " + regularKey);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the second argument of getRegularKeyOwner to be a number but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getRegularKeyOwner", [
                "0x" + codechain_primitives_1.H512.ensure(regularKey).value,
                blockNumber
            ])
                .then(function (result) {
                try {
                    resolve(result === null
                        ? null
                        : codechain_primitives_1.PlatformAddress.fromString(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getRegularKeyOwner to return a PlatformAddress string, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets the shard id of the given hash of a CreateShard transaction.
     * @param hash A transaction hash of a CreateShard transaction.
     * @param blockNumber A block number.
     * @returns A shard id.
     */
    ChainRpc.prototype.getShardIdByHash = function (hash, blockNumber) {
        var _this = this;
        if (!codechain_primitives_1.H256.check(hash)) {
            throw Error("Expected the first argument of getShardIdByHash to be an H256 value but found " + hash);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the second argument of getShardIdByHash to be a number but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getShardIdByHash", [
                codechain_primitives_1.H256.ensure(hash).toJSON(),
                blockNumber
            ])
                .then(function (result) {
                if (result === null || typeof result === "number") {
                    resolve(result);
                }
                else {
                    reject(Error("Expected chain_getShardIdByHash to return either number or null but it returned " + result));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets the owners of the shard.
     * @param shardId A shard id.
     * @returns The platform addresses of the owners.
     */
    ChainRpc.prototype.getShardOwners = function (shardId, blockNumber) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getShardOwners", [shardId, blockNumber])
                .then(function (result) {
                try {
                    resolve(result === null
                        ? null
                        : result.map(function (str) {
                            return codechain_primitives_1.PlatformAddress.ensure(str);
                        }));
                }
                catch (e) {
                    reject(Error("Expected chain_getShardOwners to return either null or an array of PlatformAddress, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets the users of the shard.
     * @param shardId A shard id.
     * @returns The platform addresses of the users.
     */
    ChainRpc.prototype.getShardUsers = function (shardId, blockNumber) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getShardUsers", [shardId, blockNumber])
                .then(function (result) {
                try {
                    resolve(result === null
                        ? null
                        : result.map(function (str) {
                            return codechain_primitives_1.PlatformAddress.ensure(str);
                        }));
                }
                catch (e) {
                    reject(Error("Expected chain_getShardUsers to return either null or an array of PlatformAddress, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets a transaction of given hash.
     * @param tracker The tracker of which to get the corresponding transaction of.
     * @returns A transaction, or null when transaction of given hash not exists.
     */
    ChainRpc.prototype.getTransactionByTracker = function (tracker) {
        var _this = this;
        if (!codechain_primitives_1.H256.check(tracker)) {
            throw Error("Expected the first argument of getTransactionByTracker to be an H256 value but found " + tracker);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getTransactionByTracker", [
                "0x" + codechain_primitives_1.H256.ensure(tracker).value
            ])
                .then(function (result) {
                try {
                    resolve(result === null
                        ? null
                        : json_1.fromJSONToSignedTransaction(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getTransactionByTracker to return either null or JSON of Transaction, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets results of a transaction of given tracker.
     * @param tracker The transaction hash of which to get the corresponding transaction of.
     * @param options.timeout Indicating milliseconds to wait the transaction to be confirmed.
     * @returns List of boolean, or null when transaction of given hash not exists.
     */
    ChainRpc.prototype.getTransactionResultsByTracker = function (tracker, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var attemptToGet, startTime, timeout, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!codechain_primitives_1.H256.check(tracker)) {
                            throw Error("Expected the first argument of getTransactionResultsByTracker to be an H256 value but found " + tracker);
                        }
                        attemptToGet = function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, this.rpc.sendRpcRequest("chain_getTransactionResultsByTracker", ["0x" + codechain_primitives_1.H256.ensure(tracker).value])];
                            });
                        }); };
                        startTime = Date.now();
                        timeout = options.timeout;
                        if (timeout !== undefined &&
                            (typeof timeout !== "number" || timeout < 0)) {
                            throw Error("Expected timeout param of getTransactionResultsByTracker to be non-negative number but found " + timeout);
                        }
                        return [4 /*yield*/, attemptToGet()];
                    case 1:
                        result = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (!(result == null &&
                            timeout !== undefined &&
                            Date.now() - startTime < timeout)) return [3 /*break*/, 5];
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, attemptToGet()];
                    case 4:
                        result = _a.sent();
                        return [3 /*break*/, 2];
                    case 5:
                        if (result == null) {
                            return [2 /*return*/, []];
                        }
                        try {
                            return [2 /*return*/, result.map(JSON.parse)];
                        }
                        catch (e) {
                            throw Error("Expected chain_getTransactionResultsByTracker to return JSON of boolean[], but an error occurred: " + e.toString() + ". received: " + JSON.stringify(result));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets balance of an account of given address, recorded in the block of given blockNumber. If blockNumber is not given, then returns balance recorded in the most recent block.
     * @param address An account address
     * @param blockNumber The specific block number to get account's balance at given address.
     * @returns Balance of account at the specified block, or null if no such block exists.
     */
    ChainRpc.prototype.getBalance = function (address, blockNumber) {
        var _this = this;
        if (!codechain_primitives_1.PlatformAddress.check(address)) {
            throw Error("Expected the first argument of getBalance to be a PlatformAddress value but found " + address);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the second argument of getBalance to be a number but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getBalance", [
                "" + codechain_primitives_1.PlatformAddress.ensure(address).value,
                blockNumber
            ])
                .then(function (result) {
                try {
                    // FIXME: Need to discuss changing the return type to `U64 | null`. It's a
                    // breaking change.
                    resolve(result === null ? null : new codechain_primitives_1.U64(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getBalance to return a value of U64, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets a hint to find out why the transaction failed.
     * @param transactionHash A transaction hash from which the error hint would get.
     * @returns Null if the transaction is not involved in the chain or succeeded. If the transaction failed, this should return the reason for the transaction failing.
     */
    ChainRpc.prototype.getErrorHint = function (transactionHash) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!codechain_primitives_1.H256.check(transactionHash)) {
                    throw Error("Expected the first argument of getErrorHint to be an H256 value but found " + transactionHash);
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.rpc
                            .sendRpcRequest("chain_getErrorHint", [
                            "0x" + codechain_primitives_1.H256.ensure(transactionHash).value
                        ])
                            .then(function (result) {
                            if (typeof result === "string" || result == null) {
                                return resolve(result);
                            }
                            reject(Error("Expected chain_getErrorHint to return either null or value of string, but it returned " + result));
                        })
                            .catch(reject);
                    })];
            });
        });
    };
    /**
     * Gets seq of an account of given address, recorded in the block of given blockNumber. If blockNumber is not given, then returns seq recorded in the most recent block.
     * @param address An account address
     * @param blockNumber The specific block number to get account's seq at given address.
     * @returns Seq of account at the specified block, or null if no such block exists.
     */
    ChainRpc.prototype.getSeq = function (address, blockNumber) {
        var _this = this;
        if (!codechain_primitives_1.PlatformAddress.check(address)) {
            throw Error("Expected the first argument of getSeq to be a PlatformAddress value but found " + address);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the second argument of getSeq to be a number but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getSeq", [
                "" + codechain_primitives_1.PlatformAddress.ensure(address).value,
                blockNumber
            ])
                .then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (result == null) {
                        throw Error("chain_getSeq returns undefined");
                    }
                    resolve(result);
                    return [2 /*return*/];
                });
            }); })
                .catch(reject);
        });
    };
    /**
     * Gets number of the latest block.
     * @returns Number of the latest block.
     */
    ChainRpc.prototype.getBestBlockNumber = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getBestBlockNumber", [])
                .then(function (result) {
                if (typeof result === "number") {
                    return resolve(result);
                }
                reject(Error("Expected chain_getBestBlockNumber to return a number, but it returned " + result));
            })
                .catch(reject);
        });
    };
    /**
     * Gets block hash of given blockNumber.
     * @param blockNumber The block number of which to get the block hash of.
     * @returns BlockHash, if block exists. Else, returns null.
     */
    ChainRpc.prototype.getBlockHash = function (blockNumber) {
        var _this = this;
        if (!isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the first argument of getBlockHash to be a non-negative integer but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getBlockHash", [blockNumber])
                .then(function (result) {
                try {
                    resolve(result === null ? null : new codechain_primitives_1.H256(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getBlockHash to return either null or a value of H256, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets block of given block hash.
     * @param hashOrNumber The block hash or number of which to get the block of
     * @returns Block, if block exists. Else, returns null.
     */
    ChainRpc.prototype.getBlock = function (hashOrNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(hashOrNumber instanceof codechain_primitives_1.H256 || typeof hashOrNumber === "string")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.rpc.sendRpcRequest("chain_getBlockByHash", [
                                "0x" + codechain_primitives_1.H256.ensure(hashOrNumber).value
                            ])];
                    case 1:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(typeof hashOrNumber === "number")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.rpc.sendRpcRequest("chain_getBlockByNumber", [
                                hashOrNumber
                            ])];
                    case 3:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 4: throw Error("Expected the first argument of getBlock to be either a number or an H256 value but found " + hashOrNumber);
                    case 5:
                        try {
                            return [2 /*return*/, result === null ? null : Block_1.Block.fromJSON(result)];
                        }
                        catch (e) {
                            throw Error("Expected chain_getBlock to return either null or JSON of Block, but an error occurred: " + e.toString());
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets asset scheme of given tracker of the mint transaction.
     * @param tracker The tracker of the mint transaction.
     * @param shardId The shard id of Asset Scheme.
     * @param blockNumber The specific block number to get the asset scheme from
     * @returns AssetScheme, if asset scheme exists. Else, returns null.
     */
    ChainRpc.prototype.getAssetSchemeByTracker = function (tracker, shardId, blockNumber) {
        var _this = this;
        if (!codechain_primitives_1.H256.check(tracker)) {
            throw Error("Expected the first arugment of getAssetSchemeByTracker to be an H256 value but found " + tracker);
        }
        if (!isShardIdValue(shardId)) {
            throw Error("Expected the second argument of getAssetSchemeByTracker to be a shard ID value but found " + shardId);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the third argument of getAssetSchemeByTracker to be non-negative integer but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getAssetSchemeByTracker", [
                "0x" + codechain_primitives_1.H256.ensure(tracker).value,
                shardId,
                blockNumber
            ])
                .then(function (result) {
                try {
                    resolve(result === null
                        ? null
                        : AssetScheme_1.AssetScheme.fromJSON(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getAssetSchemeByTracker to return either null or JSON of AssetScheme, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets asset scheme of asset type
     * @param assetType The type of Asset.
     * @param shardId The shard id of Asset Scheme.
     * @param blockNumber The specific block number to get the asset scheme from
     * @returns AssetScheme, if asset scheme exists. Else, returns null.
     */
    ChainRpc.prototype.getAssetSchemeByType = function (assetType, shardId, blockNumber) {
        var _this = this;
        if (!codechain_primitives_1.H160.check(assetType)) {
            throw Error("Expected the first arugment of getAssetSchemeByType to be an H160 value but found " + assetType);
        }
        if (!isShardIdValue(shardId)) {
            throw Error("Expected the second argument of getAssetSchemeByTracker to be a shard ID value but found " + shardId);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the second argument of getAssetSchemeByType to be non-negative integer but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getAssetSchemeByType", [
                "0x" + codechain_primitives_1.H160.ensure(assetType).value,
                shardId,
                blockNumber
            ])
                .then(function (result) {
                try {
                    resolve(result === null
                        ? null
                        : AssetScheme_1.AssetScheme.fromJSON(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getAssetSchemeByType to return either null or JSON of AssetScheme, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets asset of given transaction hash and index.
     * @param tracker The tracker of previous input transaction.
     * @param index The index of output in the transaction.
     * @param shardId The shard id of output in the transaction.
     * @param blockNumber The specific block number to get the asset from
     * @returns Asset, if asset exists, Else, returns null.
     */
    ChainRpc.prototype.getAsset = function (tracker, index, shardId, blockNumber) {
        var _this = this;
        if (!codechain_primitives_1.H256.check(tracker)) {
            throw Error("Expected the first argument of getAsset to be an H256 value but found " + tracker);
        }
        if (!isNonNegativeInterger(index)) {
            throw Error("Expected the second argument of getAsset to be non-negative integer but found " + index);
        }
        if (!isShardIdValue(shardId)) {
            throw Error("Expected the second argument of getAssetSchemeByTracker to be a shard ID value but found " + shardId);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the third argument of getAsset to be non-negative integer but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getAsset", [
                "0x" + codechain_primitives_1.H256.ensure(tracker).value,
                index,
                shardId,
                blockNumber
            ])
                .then(function (result) {
                if (result === null) {
                    return resolve(null);
                }
                try {
                    resolve(Asset_1.Asset.fromJSON(__assign({}, result, { shardId: shardId, tracker: codechain_primitives_1.H256.ensure(tracker).value, transactionOutputIndex: index })));
                }
                catch (e) {
                    reject(Error("Expected chain_getAsset to return either null or JSON of Asset, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets the text of the given hash of tx with Store type.
     * @param txHash The tx hash of the Store tx.
     * @param blockNumber The specific block number to get the text from
     * @returns Text, if text exists. Else, returns null.
     */
    ChainRpc.prototype.getText = function (txHash, blockNumber) {
        var _this = this;
        if (!codechain_primitives_1.H256.check(txHash)) {
            throw Error("Expected the first arugment of getText to be an H256 value but found " + txHash);
        }
        if (blockNumber !== undefined && !isNonNegativeInterger(blockNumber)) {
            throw Error("Expected the second argument of getText to be non-negative integer but found " + blockNumber);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getText", [
                "0x" + codechain_primitives_1.H256.ensure(txHash).value,
                blockNumber
            ])
                .then(function (result) {
                try {
                    resolve(result == null ? null : Text_1.Text.fromJSON(result));
                }
                catch (e) {
                    reject(Error("Expected chain_getText to return either null or JSON of Text, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Checks whether an asset is spent or not.
     * @param txhash The tx hash of AssetMintTransaction or AssetTransferTransaction.
     * @param index The index of output in the transaction.
     * @param shardId The shard id of an Asset.
     * @param blockNumber The specific block number to get the asset from.
     * @returns True, if the asset is spent. False, if the asset is not spent. Null, if no such asset exists.
     */
    ChainRpc.prototype.isAssetSpent = function (txhash, index, shardId, blockNumber) {
        var _this = this;
        if (!codechain_primitives_1.H256.check(txhash)) {
            throw Error("Expected the first argument of isAssetSpent to be an H256 value but found " + txhash);
        }
        if (!isNonNegativeInterger(index)) {
            throw Error("Expected the second argument of isAssetSpent to be a non-negative integer but found " + index);
        }
        if (!isShardIdValue(shardId)) {
            throw Error("Expected the third argument of isAssetSpent to be a shard ID value but found " + shardId);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_isAssetSpent", [
                "0x" + codechain_primitives_1.H256.ensure(txhash).value,
                index,
                shardId,
                blockNumber
            ])
                .then(function (result) {
                if (result === null || typeof result === "boolean") {
                    resolve(result);
                }
                else {
                    reject(Error("Expected chain_isAssetSpent to return either null or boolean but it returned " + result));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets pending transactions.
     * @returns List of SignedTransaction, with each tx has null for blockNumber/blockHash/transactionIndex.
     */
    ChainRpc.prototype.getPendingTransactions = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getPendingTransactions", [])
                .then(function (result) {
                if (!Array.isArray(result)) {
                    return reject(Error("Expected chain_getPendingTransactions to return an array but it returned " + result));
                }
                try {
                    resolve(result.map(json_1.fromJSONToSignedTransaction));
                }
                catch (e) {
                    reject(Error("Expected chain_getPendingTransactions to return an array of JSON of SignedTransaction, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets the network ID of the node.
     * @returns A network ID, e.g. "tc".
     */
    ChainRpc.prototype.getNetworkId = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getNetworkId", [])
                .then(function (result) {
                if (typeof result === "string") {
                    resolve(result);
                }
                else {
                    reject(Error("Expected chain_getNetworkId to return a string but it returned " + result));
                }
            })
                .catch(reject);
        });
    };
    return ChainRpc;
}());
exports.ChainRpc = ChainRpc;
function isNonNegativeInterger(value) {
    return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
function isShardIdValue(value) {
    return (typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 0 &&
        value <= 0xffff);
}
