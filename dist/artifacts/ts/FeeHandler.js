"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeeHandlerInstance = exports.FeeHandler = void 0;
const web3_1 = require("@alephium/web3");
const FeeHandler_ral_json_1 = __importDefault(require("../onion/FeeHandler.ral.json"));
const contracts_1 = require("./contracts");
const types_1 = require("./types");
class Factory extends web3_1.ContractFactory {
    constructor() {
        super(...arguments);
        this.eventIndex = {
            ChangeOwnerCommence: 0,
            ChangeOwnerApply: 1,
            MigrateCommence: 2,
            MigrateApply: 3,
            MigrateWithFieldsApply: 4,
        };
        this.consts = {
            UpgradeErrorCodes: {
                Forbidden: BigInt("13000"),
                UpgradePending: BigInt("13001"),
                UpgradeNotPending: BigInt("13002"),
                UpgradeDelayNotExpired: BigInt("13003"),
                MigrateNotPending: BigInt("13004"),
                MigrateWithFieldsNotPending: BigInt("13005"),
                ChangeOwnerNotPending: BigInt("13006"),
            },
        };
        this.tests = {
            changeOwner: async (params) => {
                return (0, web3_1.testMethod)(this, "changeOwner", params, contracts_1.getContractByCodeHash);
            },
            migrate: async (params) => {
                return (0, web3_1.testMethod)(this, "migrate", params, contracts_1.getContractByCodeHash);
            },
            changeOwnerApply: async (params) => {
                return (0, web3_1.testMethod)(this, "changeOwnerApply", params, contracts_1.getContractByCodeHash);
            },
            migrateApply: async (params) => {
                return (0, web3_1.testMethod)(this, "migrateApply", params, contracts_1.getContractByCodeHash);
            },
            migrateWithFieldsApply: async (params) => {
                return (0, web3_1.testMethod)(this, "migrateWithFieldsApply", params, contracts_1.getContractByCodeHash);
            },
            resetUpgrade: async (params) => {
                return (0, web3_1.testMethod)(this, "resetUpgrade", params, contracts_1.getContractByCodeHash);
            },
            getUpgradeDelay: async (params) => {
                return (0, web3_1.testMethod)(this, "getUpgradeDelay", params, contracts_1.getContractByCodeHash);
            },
            getOwner: async (params) => {
                return (0, web3_1.testMethod)(this, "getOwner", params, contracts_1.getContractByCodeHash);
            },
            getNewOwner: async (params) => {
                return (0, web3_1.testMethod)(this, "getNewOwner", params, contracts_1.getContractByCodeHash);
            },
            getUpgradeCommenced: async (params) => {
                return (0, web3_1.testMethod)(this, "getUpgradeCommenced", params, contracts_1.getContractByCodeHash);
            },
            getNewCode: async (params) => {
                return (0, web3_1.testMethod)(this, "getNewCode", params, contracts_1.getContractByCodeHash);
            },
            resetFields: async (params) => {
                return (0, web3_1.testMethod)(this, "resetFields", params, contracts_1.getContractByCodeHash);
            },
            assertOnlyOwner: async (params) => {
                return (0, web3_1.testMethod)(this, "assertOnlyOwner", params, contracts_1.getContractByCodeHash);
            },
            assertUpgradeNotPending: async (params) => {
                return (0, web3_1.testMethod)(this, "assertUpgradeNotPending", params, contracts_1.getContractByCodeHash);
            },
            assertUpgradeDelayElapsed: async (params) => {
                return (0, web3_1.testMethod)(this, "assertUpgradeDelayElapsed", params, contracts_1.getContractByCodeHash);
            },
            collect: async (params) => {
                return (0, web3_1.testMethod)(this, "collect", params, contracts_1.getContractByCodeHash);
            },
            withdraw: async (params) => {
                return (0, web3_1.testMethod)(this, "withdraw", params, contracts_1.getContractByCodeHash);
            },
            setManualCollector: async (params) => {
                return (0, web3_1.testMethod)(this, "setManualCollector", params, contracts_1.getContractByCodeHash);
            },
            setFeeCollector: async (params) => {
                return (0, web3_1.testMethod)(this, "setFeeCollector", params, contracts_1.getContractByCodeHash);
            },
        };
    }
    encodeFields(fields) {
        return (0, web3_1.encodeContractFields)((0, web3_1.addStdIdToFields)(this.contract, fields), this.contract.fieldsSig, types_1.AllStructs);
    }
    at(address) {
        return new FeeHandlerInstance(address);
    }
    stateForTest(initFields, asset, address) {
        return this.stateForTest_(initFields, asset, address, undefined);
    }
}
// Use this object to test and deploy the contract
exports.FeeHandler = new Factory(web3_1.Contract.fromJson(FeeHandler_ral_json_1.default, "", "5a9e4a6d03f7045a9bbf66449155cd43ce759474ab1e60ed4474e2d77c0ee4a3", types_1.AllStructs));
// Use this class to interact with the blockchain
class FeeHandlerInstance extends web3_1.ContractInstance {
    constructor(address) {
        super(address);
        this.view = {
            changeOwner: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "changeOwner", params, contracts_1.getContractByCodeHash);
            },
            migrate: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "migrate", params, contracts_1.getContractByCodeHash);
            },
            changeOwnerApply: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "changeOwnerApply", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            migrateApply: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "migrateApply", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            migrateWithFieldsApply: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "migrateWithFieldsApply", params, contracts_1.getContractByCodeHash);
            },
            resetUpgrade: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "resetUpgrade", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            getUpgradeDelay: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "getUpgradeDelay", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            getOwner: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "getOwner", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            getNewOwner: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "getNewOwner", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            getUpgradeCommenced: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "getUpgradeCommenced", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            getNewCode: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "getNewCode", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            resetFields: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "resetFields", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            assertOnlyOwner: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "assertOnlyOwner", params, contracts_1.getContractByCodeHash);
            },
            assertUpgradeNotPending: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "assertUpgradeNotPending", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            assertUpgradeDelayElapsed: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "assertUpgradeDelayElapsed", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            collect: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "collect", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            withdraw: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "withdraw", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            setManualCollector: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "setManualCollector", params, contracts_1.getContractByCodeHash);
            },
            setFeeCollector: async (params) => {
                return (0, web3_1.callMethod)(exports.FeeHandler, this, "setFeeCollector", params, contracts_1.getContractByCodeHash);
            },
        };
        this.transact = {
            changeOwner: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "changeOwner", params);
            },
            migrate: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "migrate", params);
            },
            changeOwnerApply: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "changeOwnerApply", params);
            },
            migrateApply: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "migrateApply", params);
            },
            migrateWithFieldsApply: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "migrateWithFieldsApply", params);
            },
            resetUpgrade: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "resetUpgrade", params);
            },
            getUpgradeDelay: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "getUpgradeDelay", params);
            },
            getOwner: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "getOwner", params);
            },
            getNewOwner: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "getNewOwner", params);
            },
            getUpgradeCommenced: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "getUpgradeCommenced", params);
            },
            getNewCode: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "getNewCode", params);
            },
            resetFields: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "resetFields", params);
            },
            assertOnlyOwner: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "assertOnlyOwner", params);
            },
            assertUpgradeNotPending: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "assertUpgradeNotPending", params);
            },
            assertUpgradeDelayElapsed: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "assertUpgradeDelayElapsed", params);
            },
            collect: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "collect", params);
            },
            withdraw: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "withdraw", params);
            },
            setManualCollector: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "setManualCollector", params);
            },
            setFeeCollector: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.FeeHandler, this, "setFeeCollector", params);
            },
        };
    }
    async fetchState() {
        return (0, web3_1.fetchContractState)(exports.FeeHandler, this);
    }
    async getContractEventsCurrentCount() {
        return (0, web3_1.getContractEventsCurrentCount)(this.address);
    }
    subscribeChangeOwnerCommenceEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.FeeHandler.contract, this, options, "ChangeOwnerCommence", fromCount);
    }
    subscribeChangeOwnerApplyEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.FeeHandler.contract, this, options, "ChangeOwnerApply", fromCount);
    }
    subscribeMigrateCommenceEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.FeeHandler.contract, this, options, "MigrateCommence", fromCount);
    }
    subscribeMigrateApplyEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.FeeHandler.contract, this, options, "MigrateApply", fromCount);
    }
    subscribeMigrateWithFieldsApplyEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.FeeHandler.contract, this, options, "MigrateWithFieldsApply", fromCount);
    }
    subscribeAllEvents(options, fromCount) {
        return (0, web3_1.subscribeContractEvents)(exports.FeeHandler.contract, this, options, fromCount);
    }
    async multicall(callss) {
        return await (0, web3_1.multicallMethods)(exports.FeeHandler, this, callss, contracts_1.getContractByCodeHash);
    }
}
exports.FeeHandlerInstance = FeeHandlerInstance;
