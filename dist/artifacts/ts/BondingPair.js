"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BondingPairInstance = exports.BondingPair = void 0;
const web3_1 = require("@alephium/web3");
const BondingPair_ral_json_1 = __importDefault(require("../trade/BondingPair.ral.json"));
const contracts_1 = require("./contracts");
const types_1 = require("./types");
class Factory extends web3_1.ContractFactory {
    constructor() {
        super(...arguments);
        this.eventIndex = { Trade: 0 };
        this.consts = {
            SCALE_64: BigInt("18446744073709551616"),
            SCALE_18: BigInt("1000000000000000000"),
            LN2: BigInt("235865763225513294137944142764154484399"),
            BASIS_POINTS_DIVISOR: BigInt("10000"),
            ROYALTY_FEE: BigInt("15"),
            PLATFORM_FEE: BigInt("85"),
            GRADUATION_FEE: BigInt("100000000000000000000"),
            FixedPointMathErrorCodes: {
                INVALID_INPUT: BigInt("100000"),
                OVERFLOW: BigInt("100001"),
            },
            ErrorCodes: {
                Unauthorized: BigInt("1"),
                TooEarlyToGraduate: BigInt("2"),
                ReadyToGraduate: BigInt("3"),
                CreatorBuysFirst: BigInt("4"),
                NotEnoughTokensLeft: BigInt("5"),
                InvalidTokenSelection: BigInt("6"),
                AmountTooSmall: BigInt("7"),
            },
        };
        this.tests = {
            to64x64: async (params) => {
                return (0, web3_1.testMethod)(this, "to64x64", params, contracts_1.getContractByCodeHash);
            },
            from64x64: async (params) => {
                return (0, web3_1.testMethod)(this, "from64x64", params, contracts_1.getContractByCodeHash);
            },
            exp: async (params) => {
                return (0, web3_1.testMethod)(this, "exp", params, contracts_1.getContractByCodeHash);
            },
            exp_2: async (params) => {
                return (0, web3_1.testMethod)(this, "exp_2", params, contracts_1.getContractByCodeHash);
            },
            ln: async (params) => {
                return (0, web3_1.testMethod)(this, "ln", params, contracts_1.getContractByCodeHash);
            },
            log_2: async (params) => {
                return (0, web3_1.testMethod)(this, "log_2", params, contracts_1.getContractByCodeHash);
            },
            getTokenId: async (params) => {
                return (0, web3_1.testMethod)(this, "getTokenId", params, contracts_1.getContractByCodeHash);
            },
            isGraduated: async (params) => {
                return (0, web3_1.testMethod)(this, "isGraduated", params, contracts_1.getContractByCodeHash);
            },
            isReadyToGraduate: async (params) => {
                return (0, web3_1.testMethod)(this, "isReadyToGraduate", params, contracts_1.getContractByCodeHash);
            },
            sell: async (params) => {
                return (0, web3_1.testMethod)(this, "sell", params, contracts_1.getContractByCodeHash);
            },
            calcSell: async (params) => {
                return (0, web3_1.testMethod)(this, "calcSell", params, contracts_1.getContractByCodeHash);
            },
            buy: async (params) => {
                return (0, web3_1.testMethod)(this, "buy", params, contracts_1.getContractByCodeHash);
            },
            calcBuy: async (params) => {
                return (0, web3_1.testMethod)(this, "calcBuy", params, contracts_1.getContractByCodeHash);
            },
            totalPriceOfTokens: async (params) => {
                return (0, web3_1.testMethod)(this, "totalPriceOfTokens", params, contracts_1.getContractByCodeHash);
            },
            graduate: async (params) => {
                return (0, web3_1.testMethod)(this, "graduate", params, contracts_1.getContractByCodeHash);
            },
        };
    }
    encodeFields(fields) {
        return (0, web3_1.encodeContractFields)((0, web3_1.addStdIdToFields)(this.contract, fields), this.contract.fieldsSig, types_1.AllStructs);
    }
    at(address) {
        return new BondingPairInstance(address);
    }
    stateForTest(initFields, asset, address) {
        return this.stateForTest_(initFields, asset, address, undefined);
    }
}
// Use this object to test and deploy the contract
exports.BondingPair = new Factory(web3_1.Contract.fromJson(BondingPair_ral_json_1.default, "", "38fb19a70c8e44ba3c5601bf42848f56cd68e5deafb4aa5f536f8541715c32cd", types_1.AllStructs));
// Use this class to interact with the blockchain
class BondingPairInstance extends web3_1.ContractInstance {
    constructor(address) {
        super(address);
        this.view = {
            to64x64: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "to64x64", params, contracts_1.getContractByCodeHash);
            },
            from64x64: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "from64x64", params, contracts_1.getContractByCodeHash);
            },
            exp: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "exp", params, contracts_1.getContractByCodeHash);
            },
            exp_2: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "exp_2", params, contracts_1.getContractByCodeHash);
            },
            ln: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "ln", params, contracts_1.getContractByCodeHash);
            },
            log_2: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "log_2", params, contracts_1.getContractByCodeHash);
            },
            getTokenId: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "getTokenId", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            isGraduated: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "isGraduated", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            isReadyToGraduate: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "isReadyToGraduate", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            sell: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "sell", params, contracts_1.getContractByCodeHash);
            },
            calcSell: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "calcSell", params, contracts_1.getContractByCodeHash);
            },
            buy: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "buy", params, contracts_1.getContractByCodeHash);
            },
            calcBuy: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "calcBuy", params, contracts_1.getContractByCodeHash);
            },
            totalPriceOfTokens: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "totalPriceOfTokens", params, contracts_1.getContractByCodeHash);
            },
            graduate: async (params) => {
                return (0, web3_1.callMethod)(exports.BondingPair, this, "graduate", params, contracts_1.getContractByCodeHash);
            },
        };
        this.transact = {
            to64x64: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "to64x64", params);
            },
            from64x64: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "from64x64", params);
            },
            exp: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "exp", params);
            },
            exp_2: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "exp_2", params);
            },
            ln: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "ln", params);
            },
            log_2: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "log_2", params);
            },
            getTokenId: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "getTokenId", params);
            },
            isGraduated: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "isGraduated", params);
            },
            isReadyToGraduate: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "isReadyToGraduate", params);
            },
            sell: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "sell", params);
            },
            calcSell: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "calcSell", params);
            },
            buy: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "buy", params);
            },
            calcBuy: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "calcBuy", params);
            },
            totalPriceOfTokens: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "totalPriceOfTokens", params);
            },
            graduate: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.BondingPair, this, "graduate", params);
            },
        };
    }
    async fetchState() {
        return (0, web3_1.fetchContractState)(exports.BondingPair, this);
    }
    async getContractEventsCurrentCount() {
        return (0, web3_1.getContractEventsCurrentCount)(this.address);
    }
    subscribeTradeEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.BondingPair.contract, this, options, "Trade", fromCount);
    }
    async multicall(callss) {
        return await (0, web3_1.multicallMethods)(exports.BondingPair, this, callss, contracts_1.getContractByCodeHash);
    }
}
exports.BondingPairInstance = BondingPairInstance;
