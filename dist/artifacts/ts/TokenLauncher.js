"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenLauncherInstance = exports.TokenLauncher = void 0;
const web3_1 = require("@alephium/web3");
const TokenLauncher_ral_json_1 = __importDefault(require("../launch/TokenLauncher.ral.json"));
const contracts_1 = require("./contracts");
const types_1 = require("./types");
const web3_2 = require("@alephium/web3");
class Factory extends web3_1.ContractFactory {
    constructor() {
        super(...arguments);
        this.eventIndex = {
            ChangeOwnerCommence: 0,
            ChangeOwnerApply: 1,
            MigrateCommence: 2,
            MigrateApply: 3,
            MigrateWithFieldsApply: 4,
            CreateToken: 5,
            CreateBondingCurve: 6,
            UpdateTokenMeta: 7,
            UpdateTokenBondingCurve: 8,
            UpdateTokenDexPair: 9,
        };
        this.consts = {
            MEMEDECIMALS: BigInt("18"),
            MEMEAMOUNT: BigInt("1000000000000000000000000000"),
            MEMELAUNCHAMOUNT: BigInt("800000000000000000000000000"),
            K: BigInt("1000000000000"),
            A: BigInt("3745000000"),
            UpgradeErrorCodes: {
                Forbidden: BigInt("13000"),
                UpgradePending: BigInt("13001"),
                UpgradeNotPending: BigInt("13002"),
                UpgradeDelayNotExpired: BigInt("13003"),
                MigrateNotPending: BigInt("13004"),
                MigrateWithFieldsNotPending: BigInt("13005"),
                ChangeOwnerNotPending: BigInt("13006"),
            },
            ErrorCodes: {
                Unauthorized: BigInt("1"),
                TokenDoesntExist: BigInt("2"),
                BondingPairAlreadyCreated: BigInt("3"),
                DexPairAlreadyCreated: BigInt("4"),
                NameTooLong: BigInt("5"),
                SymbolTooLong: BigInt("6"),
                LogoTooLong: BigInt("7"),
                DescriptionTooLong: BigInt("8"),
                SocialsTooLong: BigInt("9"),
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
            createToken: async (params) => {
                return (0, web3_1.testMethod)(this, "createToken", params, contracts_1.getContractByCodeHash);
            },
            createBondingCurve: async (params) => {
                return (0, web3_1.testMethod)(this, "createBondingCurve", params, contracts_1.getContractByCodeHash);
            },
            createDexPair: async (params) => {
                return (0, web3_1.testMethod)(this, "createDexPair", params, contracts_1.getContractByCodeHash);
            },
            updateTokenMeta: async (params) => {
                return (0, web3_1.testMethod)(this, "updateTokenMeta", params, contracts_1.getContractByCodeHash);
            },
            loadTokenMeta: async (params) => {
                return (0, web3_1.testMethod)(this, "loadTokenMeta", params, contracts_1.getContractByCodeHash);
            },
            updateSettings: async (params) => {
                return (0, web3_1.testMethod)(this, "updateSettings", params, contracts_1.getContractByCodeHash);
            },
        };
    }
    encodeFields(fields) {
        return (0, web3_1.encodeContractFields)((0, web3_1.addStdIdToFields)(this.contract, fields), this.contract.fieldsSig, types_1.AllStructs);
    }
    at(address) {
        return new TokenLauncherInstance(address);
    }
    stateForTest(initFields, asset, address, maps) {
        return this.stateForTest_(initFields, asset, address, maps);
    }
}
// Use this object to test and deploy the contract
exports.TokenLauncher = new Factory(web3_1.Contract.fromJson(TokenLauncher_ral_json_1.default, "=66-2+85=2-1=1-2=1-1=2-2=1-1+7=1-1+4f2=2-1+66=1+58d=697-1+d=466+7a7e0214696e73657274206174206d617020706174683a2000=1628", "6f3b2ad9044885afa9d2cce9a5da29beddee7edbd3bc25bd0d5f0ee89dae3de2", types_1.AllStructs));
// Use this class to interact with the blockchain
class TokenLauncherInstance extends web3_1.ContractInstance {
    constructor(address) {
        super(address);
        this.maps = {
            tokenMetaCollection: new web3_2.RalphMap(exports.TokenLauncher.contract, this.contractId, "tokenMetaCollection"),
        };
        this.view = {
            changeOwner: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "changeOwner", params, contracts_1.getContractByCodeHash);
            },
            migrate: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "migrate", params, contracts_1.getContractByCodeHash);
            },
            changeOwnerApply: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "changeOwnerApply", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            migrateApply: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "migrateApply", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            migrateWithFieldsApply: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "migrateWithFieldsApply", params, contracts_1.getContractByCodeHash);
            },
            resetUpgrade: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "resetUpgrade", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            getUpgradeDelay: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "getUpgradeDelay", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            getOwner: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "getOwner", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            getNewOwner: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "getNewOwner", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            getUpgradeCommenced: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "getUpgradeCommenced", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            getNewCode: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "getNewCode", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            resetFields: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "resetFields", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            assertOnlyOwner: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "assertOnlyOwner", params, contracts_1.getContractByCodeHash);
            },
            assertUpgradeNotPending: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "assertUpgradeNotPending", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            assertUpgradeDelayElapsed: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "assertUpgradeDelayElapsed", params === undefined ? {} : params, contracts_1.getContractByCodeHash);
            },
            createToken: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "createToken", params, contracts_1.getContractByCodeHash);
            },
            createBondingCurve: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "createBondingCurve", params, contracts_1.getContractByCodeHash);
            },
            createDexPair: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "createDexPair", params, contracts_1.getContractByCodeHash);
            },
            updateTokenMeta: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "updateTokenMeta", params, contracts_1.getContractByCodeHash);
            },
            loadTokenMeta: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "loadTokenMeta", params, contracts_1.getContractByCodeHash);
            },
            updateSettings: async (params) => {
                return (0, web3_1.callMethod)(exports.TokenLauncher, this, "updateSettings", params, contracts_1.getContractByCodeHash);
            },
        };
        this.transact = {
            changeOwner: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "changeOwner", params);
            },
            migrate: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "migrate", params);
            },
            changeOwnerApply: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "changeOwnerApply", params);
            },
            migrateApply: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "migrateApply", params);
            },
            migrateWithFieldsApply: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "migrateWithFieldsApply", params);
            },
            resetUpgrade: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "resetUpgrade", params);
            },
            getUpgradeDelay: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "getUpgradeDelay", params);
            },
            getOwner: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "getOwner", params);
            },
            getNewOwner: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "getNewOwner", params);
            },
            getUpgradeCommenced: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "getUpgradeCommenced", params);
            },
            getNewCode: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "getNewCode", params);
            },
            resetFields: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "resetFields", params);
            },
            assertOnlyOwner: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "assertOnlyOwner", params);
            },
            assertUpgradeNotPending: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "assertUpgradeNotPending", params);
            },
            assertUpgradeDelayElapsed: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "assertUpgradeDelayElapsed", params);
            },
            createToken: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "createToken", params);
            },
            createBondingCurve: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "createBondingCurve", params);
            },
            createDexPair: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "createDexPair", params);
            },
            updateTokenMeta: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "updateTokenMeta", params);
            },
            loadTokenMeta: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "loadTokenMeta", params);
            },
            updateSettings: async (params) => {
                return (0, web3_1.signExecuteMethod)(exports.TokenLauncher, this, "updateSettings", params);
            },
        };
    }
    async fetchState() {
        return (0, web3_1.fetchContractState)(exports.TokenLauncher, this);
    }
    async getContractEventsCurrentCount() {
        return (0, web3_1.getContractEventsCurrentCount)(this.address);
    }
    subscribeChangeOwnerCommenceEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.TokenLauncher.contract, this, options, "ChangeOwnerCommence", fromCount);
    }
    subscribeChangeOwnerApplyEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.TokenLauncher.contract, this, options, "ChangeOwnerApply", fromCount);
    }
    subscribeMigrateCommenceEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.TokenLauncher.contract, this, options, "MigrateCommence", fromCount);
    }
    subscribeMigrateApplyEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.TokenLauncher.contract, this, options, "MigrateApply", fromCount);
    }
    subscribeMigrateWithFieldsApplyEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.TokenLauncher.contract, this, options, "MigrateWithFieldsApply", fromCount);
    }
    subscribeCreateTokenEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.TokenLauncher.contract, this, options, "CreateToken", fromCount);
    }
    subscribeCreateBondingCurveEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.TokenLauncher.contract, this, options, "CreateBondingCurve", fromCount);
    }
    subscribeUpdateTokenMetaEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.TokenLauncher.contract, this, options, "UpdateTokenMeta", fromCount);
    }
    subscribeUpdateTokenBondingCurveEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.TokenLauncher.contract, this, options, "UpdateTokenBondingCurve", fromCount);
    }
    subscribeUpdateTokenDexPairEvent(options, fromCount) {
        return (0, web3_1.subscribeContractEvent)(exports.TokenLauncher.contract, this, options, "UpdateTokenDexPair", fromCount);
    }
    subscribeAllEvents(options, fromCount) {
        return (0, web3_1.subscribeContractEvents)(exports.TokenLauncher.contract, this, options, fromCount);
    }
    async multicall(callss) {
        return await (0, web3_1.multicallMethods)(exports.TokenLauncher, this, callss, contracts_1.getContractByCodeHash);
    }
}
exports.TokenLauncherInstance = TokenLauncherInstance;
