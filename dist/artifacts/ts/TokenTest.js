"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenTestInstance = exports.TokenTest = void 0;
const web3_1 = require("@alephium/web3");
const TokenTest_ral_json_1 = __importDefault(require("../test-contracts/TokenTest.ral.json"));
const contracts_1 = require("./contracts");
const types_1 = require("./types");
class Factory extends web3_1.ContractFactory {
    constructor() {
        super(...arguments);
        this.tests = {
            getSymbol: async (params) => {
                return (0, web3_1.testMethod)(this, "getSymbol", params, contracts_1.getContractByCodeHash);
            },
            getName: async (params) => {
                return (0, web3_1.testMethod)(this, "getName", params, contracts_1.getContractByCodeHash);
            },
            getDecimals: async (params) => {
                return (0, web3_1.testMethod)(this, "getDecimals", params, contracts_1.getContractByCodeHash);
            },
            getTotalSupply: async (params) => {
                return (0, web3_1.testMethod)(this, "getTotalSupply", params, contracts_1.getContractByCodeHash);
            },
            mintSupply: async (params) => {
                return (0, web3_1.testMethod)(this, "mintSupply", params, contracts_1.getContractByCodeHash);
            },
        };
    }
    encodeFields(fields) {
        return (0, web3_1.encodeContractFields)((0, web3_1.addStdIdToFields)(this.contract, fields), this.contract.fieldsSig, types_1.AllStructs);
    }
    at(address) {
        return new TokenTestInstance(address);
    }
    stateForTest(initFields, asset, address) {
        return this.stateForTest_(initFields, asset, address, undefined);
    }
}
// Use this object to test and deploy the contract
exports.TokenTest = new Factory(web3_1.Contract.fromJson(TokenTest_ral_json_1.default, "", "7a92239d40bacc903144594d67621dad48faf5e2bc938bfeb087df697115e3eb", types_1.AllStructs));
(0, contracts_1.registerContract)(exports.TokenTest);
// Use this class to interact with the blockchain
class TokenTestInstance extends web3_1.ContractInstance {
    constructor(address) {
        super(address);
        this.view = {
            getSymbol: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenTest, this, "getSymbol", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            getName: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenTest, this, "getName", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            getDecimals: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenTest, this, "getDecimals", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            getTotalSupply: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenTest, this, "getTotalSupply", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            mintSupply: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenTest, this, "mintSupply", params, contracts_1.getContractByCodeHash);
            },
        };
        this.transact = {
            getSymbol: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenTest, this, "getSymbol", params);
            },
            getName: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenTest, this, "getName", params);
            },
            getDecimals: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenTest, this, "getDecimals", params);
            },
            getTotalSupply: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenTest, this, "getTotalSupply", params);
            },
            mintSupply: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenTest, this, "mintSupply", params);
            },
        };
    }
    async fetchState() {
        return (0, web3_1.fetchContractState)(exports.TokenTest, this);
    }
    async multicall(callss) {
        return await (0, web3_1.multicallMethods)(exports.TokenTest, this, callss, contracts_1.getContractByCodeHash);
    }
}
exports.TokenTestInstance = TokenTestInstance;
