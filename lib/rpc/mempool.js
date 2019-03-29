"use strict";
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
var lib_1 = require("codechain-primitives/lib");
var json_1 = require("../core/transaction/json");
var MempoolRpc = /** @class */ (function () {
    /**
     * @hidden
     */
    function MempoolRpc(rpc) {
        this.rpc = rpc;
    }
    /**
     * Gets pending transactions that have the insertion timestamp within the given range.
     * @param from The lower bound of the insertion timestamp.
     * @param to The upper bound of the insertion timestamp.
     * @returns List of SignedTransaction, with each tx has null for blockNumber/blockHash/transactionIndex.
     */
    MempoolRpc.prototype.getPendingTransactions = function (from, to) {
        var _this = this;
        if (from != null && !isNonNegativeInterger(from)) {
            throw Error("Expected the first argument of getPendingTransactions to be a non-negative integer but found " + from);
        }
        if (to != null && !isNonNegativeInterger(to)) {
            throw Error("Expected the second argument of getPendingTransactions to be a non-negative integer but found " + to);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getPendingTransactions", [from, to])
                .then(function (result) {
                try {
                    var resultTransactions = result.transactions;
                    var resultLastTimestamp = result.lastTimestamp;
                    if (!Array.isArray(resultTransactions)) {
                        return reject(Error("Expected chain_getPendingTransactions to return an object whose property \"transactions\" is of array type but it is " + resultTransactions));
                    }
                    if (resultLastTimestamp !== null &&
                        typeof resultLastTimestamp !== "number") {
                        return reject(Error("Expected chain_getPendingTransactions to return an object containing a number but it returned " + resultLastTimestamp));
                    }
                    resolve({
                        transactions: resultTransactions.map(json_1.fromJSONToSignedTransaction),
                        lastTimestamp: resultLastTimestamp
                    });
                }
                catch (e) {
                    reject(Error("Expected chain_getPendingTransactions to return an object who has transactions and lastTimestamp properties, but an error occurred: " + e.toString()));
                }
            })
                .catch(reject);
        });
    };
    /**
     * Gets the count of the pending transactions within the given range from the transaction queues.
     * @param from The lower bound of collected pending transactions. If null, there is no lower bound.
     * @param to The upper bound of collected pending transactions. If null, there is no upper bound.
     * @returns The count of the pending transactions.
     */
    MempoolRpc.prototype.getPendingTransactionsCount = function (from, to) {
        var _this = this;
        if (from != null && !isNonNegativeInterger(from)) {
            throw Error("Expected the first argument of getPendingTransactions to be a non-negative integer but found " + from);
        }
        if (to != null && !isNonNegativeInterger(to)) {
            throw Error("Expected the second argument of getPendingTransactions to be a non-negative integer but found " + to);
        }
        return new Promise(function (resolve, reject) {
            _this.rpc
                .sendRpcRequest("chain_getPendingTransactionsCount", [from, to])
                .then(function (result) {
                if (typeof result === "number") {
                    resolve(result);
                }
                else {
                    reject(Error("Expected chain_getPendingTransactionsCount to return a number but returned " + result));
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
    MempoolRpc.prototype.getErrorHint = function (transactionHash) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!lib_1.H256.check(transactionHash)) {
                    throw Error("Expected the first argument of getErrorHint to be an H256 value but found " + transactionHash);
                }
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.rpc
                            .sendRpcRequest("chain_getErrorHint", [
                            "0x" + lib_1.H256.ensure(transactionHash).value
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
    return MempoolRpc;
}());
exports.MempoolRpc = MempoolRpc;
function isNonNegativeInterger(value) {
    return typeof value === "number" && Number.isInteger(value) && value >= 0;
}
