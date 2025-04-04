"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedPointMathTestInstance = exports.FixedPointMathTest = void 0;
const web3_1 = require("@alephium/web3");
const FixedPointMathTest_ral_json_1 = __importDefault(require("../dummy/FixedPointMathTest.ral.json"));
const contracts_1 = require("./contracts");
const types_1 = require("./types");
class Factory extends web3_1.ContractFactory {
    constructor() {
        super(...arguments);
        this.consts = {
            SCALE_64: BigInt("18446744073709551616"),
            SCALE_18: BigInt("1000000000000000000"),
            LN2: BigInt("235865763225513294137944142764154484399"),
            FixedPointMathErrorCodes: {
                INVALID_INPUT: BigInt("100000"),
                OVERFLOW: BigInt("100001"),
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
        };
    }
    encodeFields() {
        return (0, web3_1.encodeContractFields)({}, this.contract.fieldsSig, types_1.AllStructs);
    }
    at(address) {
        return new FixedPointMathTestInstance(address);
    }
    stateForTest(initFields, asset, address) {
        return this.stateForTest_(initFields, asset, address, undefined);
    }
}
// Use this object to test and deploy the contract
exports.FixedPointMathTest = new Factory(web3_1.Contract.fromJson(FixedPointMathTest_ral_json_1.default, "", "4fe0925e4611c2822212b5bd470ceec16b6e2eb357771b8b7e6f2852735d9fed", types_1.AllStructs));
// Use this class to interact with the blockchain
class FixedPointMathTestInstance extends web3_1.ContractInstance {
    constructor(address) {
        super(address);
        this.view = {
            to64x64: async (params) => {
                return (0, web3_1.callMethod)(exports.FixedPointMathTest, this, "to64x64", params, contracts_1.getContractByCodeHash);
            },
            from64x64: async (params) => {
                return (0, web3_1.callMethod)(exports.FixedPointMathTest, this, "from64x64", params, contracts_1.getContractByCodeHash);
            },
            exp: async (params) => {
                return (0, web3_1.callMethod)(exports.FixedPointMathTest, this, "exp", params, contracts_1.getContractByCodeHash);
            },
            exp_2: async (params) => {
                return (0, web3_1.callMethod)(exports.FixedPointMathTest, this, "exp_2", params, contracts_1.getContractByCodeHash);
            },
            ln: async (params) => {
                return (0, web3_1.callMethod)(exports.FixedPointMathTest, this, "ln", params, contracts_1.getContractByCodeHash);
            },
            log_2: async (params) => {
                return (0, web3_1.callMethod)(exports.FixedPointMathTest, this, "log_2", params, contracts_1.getContractByCodeHash);
            },
        };
        this.transact = {
            to64x64: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FixedPointMathTest, this, "to64x64", params);
            },
            from64x64: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FixedPointMathTest, this, "from64x64", params);
            },
            exp: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FixedPointMathTest, this, "exp", params);
            },
            exp_2: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FixedPointMathTest, this, "exp_2", params);
            },
            ln: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FixedPointMathTest, this, "ln", params);
            },
            log_2: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FixedPointMathTest, this, "log_2", params);
            },
        };
    }
    async fetchState() {
        return (0, web3_1.fetchContractState)(exports.FixedPointMathTest, this);
    }
    async multicall(callss) {
        return await (0, web3_1.multicallMethods)(exports.FixedPointMathTest, this, callss, contracts_1.getContractByCodeHash);
    }
}
exports.FixedPointMathTestInstance = FixedPointMathTestInstance;
