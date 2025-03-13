/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  EventSubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  Asset,
  ContractInstance,
  getContractEventsCurrentCount,
  TestContractParamsWithoutMaps,
  TestContractResultWithoutMaps,
  SignExecuteContractMethodParams,
  SignExecuteScriptTxResult,
  signExecuteMethod,
  addStdIdToFields,
  encodeContractFields,
  Narrow,
} from "@alephium/web3";
import { default as ProfileTrackerContractJson } from "../value_add/ProfileTracker.ral.json";
import { getContractByCodeHash } from "./contracts";
import {
  TokenLauncherSettings,
  TokenMetaData,
  UpgradableSettings,
  UserProfile,
  AllStructs,
} from "./types";
import { RalphMap } from "@alephium/web3";

// Custom types for the contract
export namespace ProfileTrackerTypes {
  export type Fields = {
    router: Address;
    referralThreshold: bigint;
    referralReward: bigint;
    upgradableSettings: UpgradableSettings;
  };

  export type State = ContractState<Fields>;

  export type ChangeOwnerCommenceEvent = ContractEvent<{
    owner: Address;
    changeOwner: Address;
  }>;
  export type ChangeOwnerApplyEvent = ContractEvent<{
    owner: Address;
    changeOwner: Address;
  }>;
  export type MigrateCommenceEvent = ContractEvent<{
    owner: Address;
    changeCode: HexString;
  }>;
  export type MigrateApplyEvent = ContractEvent<{
    owner: Address;
    changeCode: HexString;
  }>;
  export type MigrateWithFieldsApplyEvent = ContractEvent<{
    owner: Address;
    changeCode: HexString;
    changeImmFieldsEncoded: HexString;
    changeMutFieldsEncoded: HexString;
  }>;
  export type CreateProfileEvent = ContractEvent<{
    caller: Address;
    pfp: HexString;
    name: HexString;
    status: HexString;
    xp: bigint;
    referrer: Address;
    linkingId: HexString;
    socials: HexString;
  }>;
  export type UpdateProfileEvent = ContractEvent<{
    caller: Address;
    pfp: HexString;
    name: HexString;
    status: HexString;
    xp: bigint;
    linkingId: HexString;
    socials: HexString;
  }>;
  export type UpdateRouterAddressEvent = ContractEvent<{
    caller: Address;
    oldRouter: Address;
    newRouter: Address;
  }>;
  export type UpdateReferralSettingsEvent = ContractEvent<{
    caller: Address;
    oldReferralThreshold: bigint;
    oldReferralReward: bigint;
    newReferralThreshold: bigint;
    newReferralReward: bigint;
  }>;

  export interface CallMethodTable {
    changeOwner: {
      params: CallContractParams<{ changeOwner: Address }>;
      result: CallContractResult<null>;
    };
    migrate: {
      params: CallContractParams<{ changeCode: HexString }>;
      result: CallContractResult<null>;
    };
    changeOwnerApply: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<null>;
    };
    migrateApply: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<null>;
    };
    migrateWithFieldsApply: {
      params: CallContractParams<{
        newImmFieldsEncoded: HexString;
        newMutFieldsEncoded: HexString;
      }>;
      result: CallContractResult<null>;
    };
    resetUpgrade: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<null>;
    };
    getUpgradeDelay: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getOwner: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<Address>;
    };
    getNewOwner: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<Address>;
    };
    getUpgradeCommenced: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getNewCode: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<HexString>;
    };
    resetFields: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<null>;
    };
    assertOnlyOwner: {
      params: CallContractParams<{ caller: Address }>;
      result: CallContractResult<null>;
    };
    assertUpgradeNotPending: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<null>;
    };
    assertUpgradeDelayElapsed: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<null>;
    };
    manageProfileSelf: {
      params: CallContractParams<{
        pfp: HexString;
        name: HexString;
        status: HexString;
        referrer: Address;
        linkingId: HexString;
        socials: HexString;
      }>;
      result: CallContractResult<null>;
    };
    manageProfileFromRouter: {
      params: CallContractParams<{
        caller: Address;
        referrer: Address;
        xp: bigint;
      }>;
      result: CallContractResult<null>;
    };
    increaseXP: {
      params: CallContractParams<{
        caller: Address;
        referrer: Address;
        xp: bigint;
      }>;
      result: CallContractResult<null>;
    };
    rewardReferrer: {
      params: CallContractParams<{
        referrer: Address;
        reward: bigint;
        caller: Address;
      }>;
      result: CallContractResult<null>;
    };
    loadUserProfile: {
      params: CallContractParams<{ caller: Address }>;
      result: CallContractResult<[boolean, UserProfile]>;
    };
    updateRouterAddress: {
      params: CallContractParams<{ newRouter: Address }>;
      result: CallContractResult<null>;
    };
    updateReferralSettings: {
      params: CallContractParams<{
        newReferralThreshold: bigint;
        newReferralReward: bigint;
      }>;
      result: CallContractResult<null>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
  export type MulticallReturnType<Callss extends MultiCallParams[]> = {
    [index in keyof Callss]: MultiCallResults<Callss[index]>;
  };

  export interface SignExecuteMethodTable {
    changeOwner: {
      params: SignExecuteContractMethodParams<{ changeOwner: Address }>;
      result: SignExecuteScriptTxResult;
    };
    migrate: {
      params: SignExecuteContractMethodParams<{ changeCode: HexString }>;
      result: SignExecuteScriptTxResult;
    };
    changeOwnerApply: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    migrateApply: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    migrateWithFieldsApply: {
      params: SignExecuteContractMethodParams<{
        newImmFieldsEncoded: HexString;
        newMutFieldsEncoded: HexString;
      }>;
      result: SignExecuteScriptTxResult;
    };
    resetUpgrade: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getUpgradeDelay: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getOwner: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getNewOwner: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getUpgradeCommenced: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    getNewCode: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    resetFields: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    assertOnlyOwner: {
      params: SignExecuteContractMethodParams<{ caller: Address }>;
      result: SignExecuteScriptTxResult;
    };
    assertUpgradeNotPending: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    assertUpgradeDelayElapsed: {
      params: Omit<SignExecuteContractMethodParams<{}>, "args">;
      result: SignExecuteScriptTxResult;
    };
    manageProfileSelf: {
      params: SignExecuteContractMethodParams<{
        pfp: HexString;
        name: HexString;
        status: HexString;
        referrer: Address;
        linkingId: HexString;
        socials: HexString;
      }>;
      result: SignExecuteScriptTxResult;
    };
    manageProfileFromRouter: {
      params: SignExecuteContractMethodParams<{
        caller: Address;
        referrer: Address;
        xp: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
    increaseXP: {
      params: SignExecuteContractMethodParams<{
        caller: Address;
        referrer: Address;
        xp: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
    rewardReferrer: {
      params: SignExecuteContractMethodParams<{
        referrer: Address;
        reward: bigint;
        caller: Address;
      }>;
      result: SignExecuteScriptTxResult;
    };
    loadUserProfile: {
      params: SignExecuteContractMethodParams<{ caller: Address }>;
      result: SignExecuteScriptTxResult;
    };
    updateRouterAddress: {
      params: SignExecuteContractMethodParams<{ newRouter: Address }>;
      result: SignExecuteScriptTxResult;
    };
    updateReferralSettings: {
      params: SignExecuteContractMethodParams<{
        newReferralThreshold: bigint;
        newReferralReward: bigint;
      }>;
      result: SignExecuteScriptTxResult;
    };
  }
  export type SignExecuteMethodParams<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["params"];
  export type SignExecuteMethodResult<T extends keyof SignExecuteMethodTable> =
    SignExecuteMethodTable[T]["result"];

  export type Maps = { userProfileCollection?: Map<Address, UserProfile> };
}

class Factory extends ContractFactory<
  ProfileTrackerInstance,
  ProfileTrackerTypes.Fields
> {
  encodeFields(fields: ProfileTrackerTypes.Fields) {
    return encodeContractFields(
      addStdIdToFields(this.contract, fields),
      this.contract.fieldsSig,
      AllStructs
    );
  }

  eventIndex = {
    ChangeOwnerCommence: 0,
    ChangeOwnerApply: 1,
    MigrateCommence: 2,
    MigrateApply: 3,
    MigrateWithFieldsApply: 4,
    CreateProfile: 5,
    UpdateProfile: 6,
    UpdateRouterAddress: 7,
    UpdateReferralSettings: 8,
  };
  consts = {
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

  at(address: string): ProfileTrackerInstance {
    return new ProfileTrackerInstance(address);
  }

  tests = {
    changeOwner: async (
      params: TestContractParams<
        ProfileTrackerTypes.Fields,
        { changeOwner: Address },
        ProfileTrackerTypes.Maps
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(this, "changeOwner", params, getContractByCodeHash);
    },
    migrate: async (
      params: TestContractParams<
        ProfileTrackerTypes.Fields,
        { changeCode: HexString },
        ProfileTrackerTypes.Maps
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(this, "migrate", params, getContractByCodeHash);
    },
    changeOwnerApply: async (
      params: Omit<
        TestContractParams<
          ProfileTrackerTypes.Fields,
          never,
          ProfileTrackerTypes.Maps
        >,
        "testArgs"
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(
        this,
        "changeOwnerApply",
        params,
        getContractByCodeHash
      );
    },
    migrateApply: async (
      params: Omit<
        TestContractParams<
          ProfileTrackerTypes.Fields,
          never,
          ProfileTrackerTypes.Maps
        >,
        "testArgs"
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(this, "migrateApply", params, getContractByCodeHash);
    },
    migrateWithFieldsApply: async (
      params: TestContractParams<
        ProfileTrackerTypes.Fields,
        { newImmFieldsEncoded: HexString; newMutFieldsEncoded: HexString },
        ProfileTrackerTypes.Maps
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(
        this,
        "migrateWithFieldsApply",
        params,
        getContractByCodeHash
      );
    },
    resetUpgrade: async (
      params: Omit<
        TestContractParams<
          ProfileTrackerTypes.Fields,
          never,
          ProfileTrackerTypes.Maps
        >,
        "testArgs"
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(this, "resetUpgrade", params, getContractByCodeHash);
    },
    getUpgradeDelay: async (
      params: Omit<
        TestContractParams<
          ProfileTrackerTypes.Fields,
          never,
          ProfileTrackerTypes.Maps
        >,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint, ProfileTrackerTypes.Maps>> => {
      return testMethod(this, "getUpgradeDelay", params, getContractByCodeHash);
    },
    getOwner: async (
      params: Omit<
        TestContractParams<
          ProfileTrackerTypes.Fields,
          never,
          ProfileTrackerTypes.Maps
        >,
        "testArgs"
      >
    ): Promise<TestContractResult<Address, ProfileTrackerTypes.Maps>> => {
      return testMethod(this, "getOwner", params, getContractByCodeHash);
    },
    getNewOwner: async (
      params: Omit<
        TestContractParams<
          ProfileTrackerTypes.Fields,
          never,
          ProfileTrackerTypes.Maps
        >,
        "testArgs"
      >
    ): Promise<TestContractResult<Address, ProfileTrackerTypes.Maps>> => {
      return testMethod(this, "getNewOwner", params, getContractByCodeHash);
    },
    getUpgradeCommenced: async (
      params: Omit<
        TestContractParams<
          ProfileTrackerTypes.Fields,
          never,
          ProfileTrackerTypes.Maps
        >,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint, ProfileTrackerTypes.Maps>> => {
      return testMethod(
        this,
        "getUpgradeCommenced",
        params,
        getContractByCodeHash
      );
    },
    getNewCode: async (
      params: Omit<
        TestContractParams<
          ProfileTrackerTypes.Fields,
          never,
          ProfileTrackerTypes.Maps
        >,
        "testArgs"
      >
    ): Promise<TestContractResult<HexString, ProfileTrackerTypes.Maps>> => {
      return testMethod(this, "getNewCode", params, getContractByCodeHash);
    },
    resetFields: async (
      params: Omit<
        TestContractParams<
          ProfileTrackerTypes.Fields,
          never,
          ProfileTrackerTypes.Maps
        >,
        "testArgs"
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(this, "resetFields", params, getContractByCodeHash);
    },
    assertOnlyOwner: async (
      params: TestContractParams<
        ProfileTrackerTypes.Fields,
        { caller: Address },
        ProfileTrackerTypes.Maps
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(this, "assertOnlyOwner", params, getContractByCodeHash);
    },
    assertUpgradeNotPending: async (
      params: Omit<
        TestContractParams<
          ProfileTrackerTypes.Fields,
          never,
          ProfileTrackerTypes.Maps
        >,
        "testArgs"
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(
        this,
        "assertUpgradeNotPending",
        params,
        getContractByCodeHash
      );
    },
    assertUpgradeDelayElapsed: async (
      params: Omit<
        TestContractParams<
          ProfileTrackerTypes.Fields,
          never,
          ProfileTrackerTypes.Maps
        >,
        "testArgs"
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(
        this,
        "assertUpgradeDelayElapsed",
        params,
        getContractByCodeHash
      );
    },
    manageProfileSelf: async (
      params: TestContractParams<
        ProfileTrackerTypes.Fields,
        {
          pfp: HexString;
          name: HexString;
          status: HexString;
          referrer: Address;
          linkingId: HexString;
          socials: HexString;
        },
        ProfileTrackerTypes.Maps
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(
        this,
        "manageProfileSelf",
        params,
        getContractByCodeHash
      );
    },
    manageProfileFromRouter: async (
      params: TestContractParams<
        ProfileTrackerTypes.Fields,
        { caller: Address; referrer: Address; xp: bigint },
        ProfileTrackerTypes.Maps
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(
        this,
        "manageProfileFromRouter",
        params,
        getContractByCodeHash
      );
    },
    increaseXP: async (
      params: TestContractParams<
        ProfileTrackerTypes.Fields,
        { caller: Address; referrer: Address; xp: bigint },
        ProfileTrackerTypes.Maps
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(this, "increaseXP", params, getContractByCodeHash);
    },
    rewardReferrer: async (
      params: TestContractParams<
        ProfileTrackerTypes.Fields,
        { referrer: Address; reward: bigint; caller: Address },
        ProfileTrackerTypes.Maps
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(this, "rewardReferrer", params, getContractByCodeHash);
    },
    loadUserProfile: async (
      params: TestContractParams<
        ProfileTrackerTypes.Fields,
        { caller: Address },
        ProfileTrackerTypes.Maps
      >
    ): Promise<
      TestContractResult<[boolean, UserProfile], ProfileTrackerTypes.Maps>
    > => {
      return testMethod(this, "loadUserProfile", params, getContractByCodeHash);
    },
    updateRouterAddress: async (
      params: TestContractParams<
        ProfileTrackerTypes.Fields,
        { newRouter: Address },
        ProfileTrackerTypes.Maps
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(
        this,
        "updateRouterAddress",
        params,
        getContractByCodeHash
      );
    },
    updateReferralSettings: async (
      params: TestContractParams<
        ProfileTrackerTypes.Fields,
        { newReferralThreshold: bigint; newReferralReward: bigint },
        ProfileTrackerTypes.Maps
      >
    ): Promise<TestContractResult<null, ProfileTrackerTypes.Maps>> => {
      return testMethod(
        this,
        "updateReferralSettings",
        params,
        getContractByCodeHash
      );
    },
  };

  stateForTest(
    initFields: ProfileTrackerTypes.Fields,
    asset?: Asset,
    address?: string,
    maps?: ProfileTrackerTypes.Maps
  ) {
    return this.stateForTest_(initFields, asset, address, maps);
  }
}

// Use this object to test and deploy the contract
export const ProfileTracker = new Factory(
  Contract.fromJson(
    ProfileTrackerContractJson,
    "=66-2+55=2-2+76=2-5+c=3-2+81=2-2+f6=1+515=1-2+53c=697-1+5=311-1+2=62+7a7e0214696e73657274206174206d617020706174683a2000=151-1+7=359-1+4=70+7a7e0214696e73657274206174206d617020706174683a2000=191-1+3=233-1+2=40+7a7e0214696e73657274206174206d617020706174683a2000=410",
    "d9bf59b4aa70c5e1fe9367f6eff69a4b6bbb08db275d72315998a18e5fb7a1ce",
    AllStructs
  )
);

// Use this class to interact with the blockchain
export class ProfileTrackerInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  maps = {
    userProfileCollection: new RalphMap<Address, UserProfile>(
      ProfileTracker.contract,
      this.contractId,
      "userProfileCollection"
    ),
  };

  async fetchState(): Promise<ProfileTrackerTypes.State> {
    return fetchContractState(ProfileTracker, this);
  }

  async getContractEventsCurrentCount(): Promise<number> {
    return getContractEventsCurrentCount(this.address);
  }

  subscribeChangeOwnerCommenceEvent(
    options: EventSubscribeOptions<ProfileTrackerTypes.ChangeOwnerCommenceEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      ProfileTracker.contract,
      this,
      options,
      "ChangeOwnerCommence",
      fromCount
    );
  }

  subscribeChangeOwnerApplyEvent(
    options: EventSubscribeOptions<ProfileTrackerTypes.ChangeOwnerApplyEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      ProfileTracker.contract,
      this,
      options,
      "ChangeOwnerApply",
      fromCount
    );
  }

  subscribeMigrateCommenceEvent(
    options: EventSubscribeOptions<ProfileTrackerTypes.MigrateCommenceEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      ProfileTracker.contract,
      this,
      options,
      "MigrateCommence",
      fromCount
    );
  }

  subscribeMigrateApplyEvent(
    options: EventSubscribeOptions<ProfileTrackerTypes.MigrateApplyEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      ProfileTracker.contract,
      this,
      options,
      "MigrateApply",
      fromCount
    );
  }

  subscribeMigrateWithFieldsApplyEvent(
    options: EventSubscribeOptions<ProfileTrackerTypes.MigrateWithFieldsApplyEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      ProfileTracker.contract,
      this,
      options,
      "MigrateWithFieldsApply",
      fromCount
    );
  }

  subscribeCreateProfileEvent(
    options: EventSubscribeOptions<ProfileTrackerTypes.CreateProfileEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      ProfileTracker.contract,
      this,
      options,
      "CreateProfile",
      fromCount
    );
  }

  subscribeUpdateProfileEvent(
    options: EventSubscribeOptions<ProfileTrackerTypes.UpdateProfileEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      ProfileTracker.contract,
      this,
      options,
      "UpdateProfile",
      fromCount
    );
  }

  subscribeUpdateRouterAddressEvent(
    options: EventSubscribeOptions<ProfileTrackerTypes.UpdateRouterAddressEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      ProfileTracker.contract,
      this,
      options,
      "UpdateRouterAddress",
      fromCount
    );
  }

  subscribeUpdateReferralSettingsEvent(
    options: EventSubscribeOptions<ProfileTrackerTypes.UpdateReferralSettingsEvent>,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvent(
      ProfileTracker.contract,
      this,
      options,
      "UpdateReferralSettings",
      fromCount
    );
  }

  subscribeAllEvents(
    options: EventSubscribeOptions<
      | ProfileTrackerTypes.ChangeOwnerCommenceEvent
      | ProfileTrackerTypes.ChangeOwnerApplyEvent
      | ProfileTrackerTypes.MigrateCommenceEvent
      | ProfileTrackerTypes.MigrateApplyEvent
      | ProfileTrackerTypes.MigrateWithFieldsApplyEvent
      | ProfileTrackerTypes.CreateProfileEvent
      | ProfileTrackerTypes.UpdateProfileEvent
      | ProfileTrackerTypes.UpdateRouterAddressEvent
      | ProfileTrackerTypes.UpdateReferralSettingsEvent
    >,
    fromCount?: number
  ): EventSubscription {
    return subscribeContractEvents(
      ProfileTracker.contract,
      this,
      options,
      fromCount
    );
  }

  view = {
    changeOwner: async (
      params: ProfileTrackerTypes.CallMethodParams<"changeOwner">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"changeOwner">> => {
      return callMethod(
        ProfileTracker,
        this,
        "changeOwner",
        params,
        getContractByCodeHash
      );
    },
    migrate: async (
      params: ProfileTrackerTypes.CallMethodParams<"migrate">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"migrate">> => {
      return callMethod(
        ProfileTracker,
        this,
        "migrate",
        params,
        getContractByCodeHash
      );
    },
    changeOwnerApply: async (
      params?: ProfileTrackerTypes.CallMethodParams<"changeOwnerApply">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"changeOwnerApply">> => {
      return callMethod(
        ProfileTracker,
        this,
        "changeOwnerApply",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    migrateApply: async (
      params?: ProfileTrackerTypes.CallMethodParams<"migrateApply">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"migrateApply">> => {
      return callMethod(
        ProfileTracker,
        this,
        "migrateApply",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    migrateWithFieldsApply: async (
      params: ProfileTrackerTypes.CallMethodParams<"migrateWithFieldsApply">
    ): Promise<
      ProfileTrackerTypes.CallMethodResult<"migrateWithFieldsApply">
    > => {
      return callMethod(
        ProfileTracker,
        this,
        "migrateWithFieldsApply",
        params,
        getContractByCodeHash
      );
    },
    resetUpgrade: async (
      params?: ProfileTrackerTypes.CallMethodParams<"resetUpgrade">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"resetUpgrade">> => {
      return callMethod(
        ProfileTracker,
        this,
        "resetUpgrade",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getUpgradeDelay: async (
      params?: ProfileTrackerTypes.CallMethodParams<"getUpgradeDelay">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"getUpgradeDelay">> => {
      return callMethod(
        ProfileTracker,
        this,
        "getUpgradeDelay",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getOwner: async (
      params?: ProfileTrackerTypes.CallMethodParams<"getOwner">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"getOwner">> => {
      return callMethod(
        ProfileTracker,
        this,
        "getOwner",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getNewOwner: async (
      params?: ProfileTrackerTypes.CallMethodParams<"getNewOwner">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"getNewOwner">> => {
      return callMethod(
        ProfileTracker,
        this,
        "getNewOwner",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getUpgradeCommenced: async (
      params?: ProfileTrackerTypes.CallMethodParams<"getUpgradeCommenced">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"getUpgradeCommenced">> => {
      return callMethod(
        ProfileTracker,
        this,
        "getUpgradeCommenced",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getNewCode: async (
      params?: ProfileTrackerTypes.CallMethodParams<"getNewCode">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"getNewCode">> => {
      return callMethod(
        ProfileTracker,
        this,
        "getNewCode",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    resetFields: async (
      params?: ProfileTrackerTypes.CallMethodParams<"resetFields">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"resetFields">> => {
      return callMethod(
        ProfileTracker,
        this,
        "resetFields",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    assertOnlyOwner: async (
      params: ProfileTrackerTypes.CallMethodParams<"assertOnlyOwner">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"assertOnlyOwner">> => {
      return callMethod(
        ProfileTracker,
        this,
        "assertOnlyOwner",
        params,
        getContractByCodeHash
      );
    },
    assertUpgradeNotPending: async (
      params?: ProfileTrackerTypes.CallMethodParams<"assertUpgradeNotPending">
    ): Promise<
      ProfileTrackerTypes.CallMethodResult<"assertUpgradeNotPending">
    > => {
      return callMethod(
        ProfileTracker,
        this,
        "assertUpgradeNotPending",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    assertUpgradeDelayElapsed: async (
      params?: ProfileTrackerTypes.CallMethodParams<"assertUpgradeDelayElapsed">
    ): Promise<
      ProfileTrackerTypes.CallMethodResult<"assertUpgradeDelayElapsed">
    > => {
      return callMethod(
        ProfileTracker,
        this,
        "assertUpgradeDelayElapsed",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    manageProfileSelf: async (
      params: ProfileTrackerTypes.CallMethodParams<"manageProfileSelf">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"manageProfileSelf">> => {
      return callMethod(
        ProfileTracker,
        this,
        "manageProfileSelf",
        params,
        getContractByCodeHash
      );
    },
    manageProfileFromRouter: async (
      params: ProfileTrackerTypes.CallMethodParams<"manageProfileFromRouter">
    ): Promise<
      ProfileTrackerTypes.CallMethodResult<"manageProfileFromRouter">
    > => {
      return callMethod(
        ProfileTracker,
        this,
        "manageProfileFromRouter",
        params,
        getContractByCodeHash
      );
    },
    increaseXP: async (
      params: ProfileTrackerTypes.CallMethodParams<"increaseXP">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"increaseXP">> => {
      return callMethod(
        ProfileTracker,
        this,
        "increaseXP",
        params,
        getContractByCodeHash
      );
    },
    rewardReferrer: async (
      params: ProfileTrackerTypes.CallMethodParams<"rewardReferrer">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"rewardReferrer">> => {
      return callMethod(
        ProfileTracker,
        this,
        "rewardReferrer",
        params,
        getContractByCodeHash
      );
    },
    loadUserProfile: async (
      params: ProfileTrackerTypes.CallMethodParams<"loadUserProfile">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"loadUserProfile">> => {
      return callMethod(
        ProfileTracker,
        this,
        "loadUserProfile",
        params,
        getContractByCodeHash
      );
    },
    updateRouterAddress: async (
      params: ProfileTrackerTypes.CallMethodParams<"updateRouterAddress">
    ): Promise<ProfileTrackerTypes.CallMethodResult<"updateRouterAddress">> => {
      return callMethod(
        ProfileTracker,
        this,
        "updateRouterAddress",
        params,
        getContractByCodeHash
      );
    },
    updateReferralSettings: async (
      params: ProfileTrackerTypes.CallMethodParams<"updateReferralSettings">
    ): Promise<
      ProfileTrackerTypes.CallMethodResult<"updateReferralSettings">
    > => {
      return callMethod(
        ProfileTracker,
        this,
        "updateReferralSettings",
        params,
        getContractByCodeHash
      );
    },
  };

  transact = {
    changeOwner: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"changeOwner">
    ): Promise<ProfileTrackerTypes.SignExecuteMethodResult<"changeOwner">> => {
      return signExecuteMethod(ProfileTracker, this, "changeOwner", params);
    },
    migrate: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"migrate">
    ): Promise<ProfileTrackerTypes.SignExecuteMethodResult<"migrate">> => {
      return signExecuteMethod(ProfileTracker, this, "migrate", params);
    },
    changeOwnerApply: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"changeOwnerApply">
    ): Promise<
      ProfileTrackerTypes.SignExecuteMethodResult<"changeOwnerApply">
    > => {
      return signExecuteMethod(
        ProfileTracker,
        this,
        "changeOwnerApply",
        params
      );
    },
    migrateApply: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"migrateApply">
    ): Promise<ProfileTrackerTypes.SignExecuteMethodResult<"migrateApply">> => {
      return signExecuteMethod(ProfileTracker, this, "migrateApply", params);
    },
    migrateWithFieldsApply: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"migrateWithFieldsApply">
    ): Promise<
      ProfileTrackerTypes.SignExecuteMethodResult<"migrateWithFieldsApply">
    > => {
      return signExecuteMethod(
        ProfileTracker,
        this,
        "migrateWithFieldsApply",
        params
      );
    },
    resetUpgrade: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"resetUpgrade">
    ): Promise<ProfileTrackerTypes.SignExecuteMethodResult<"resetUpgrade">> => {
      return signExecuteMethod(ProfileTracker, this, "resetUpgrade", params);
    },
    getUpgradeDelay: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"getUpgradeDelay">
    ): Promise<
      ProfileTrackerTypes.SignExecuteMethodResult<"getUpgradeDelay">
    > => {
      return signExecuteMethod(ProfileTracker, this, "getUpgradeDelay", params);
    },
    getOwner: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"getOwner">
    ): Promise<ProfileTrackerTypes.SignExecuteMethodResult<"getOwner">> => {
      return signExecuteMethod(ProfileTracker, this, "getOwner", params);
    },
    getNewOwner: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"getNewOwner">
    ): Promise<ProfileTrackerTypes.SignExecuteMethodResult<"getNewOwner">> => {
      return signExecuteMethod(ProfileTracker, this, "getNewOwner", params);
    },
    getUpgradeCommenced: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"getUpgradeCommenced">
    ): Promise<
      ProfileTrackerTypes.SignExecuteMethodResult<"getUpgradeCommenced">
    > => {
      return signExecuteMethod(
        ProfileTracker,
        this,
        "getUpgradeCommenced",
        params
      );
    },
    getNewCode: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"getNewCode">
    ): Promise<ProfileTrackerTypes.SignExecuteMethodResult<"getNewCode">> => {
      return signExecuteMethod(ProfileTracker, this, "getNewCode", params);
    },
    resetFields: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"resetFields">
    ): Promise<ProfileTrackerTypes.SignExecuteMethodResult<"resetFields">> => {
      return signExecuteMethod(ProfileTracker, this, "resetFields", params);
    },
    assertOnlyOwner: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"assertOnlyOwner">
    ): Promise<
      ProfileTrackerTypes.SignExecuteMethodResult<"assertOnlyOwner">
    > => {
      return signExecuteMethod(ProfileTracker, this, "assertOnlyOwner", params);
    },
    assertUpgradeNotPending: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"assertUpgradeNotPending">
    ): Promise<
      ProfileTrackerTypes.SignExecuteMethodResult<"assertUpgradeNotPending">
    > => {
      return signExecuteMethod(
        ProfileTracker,
        this,
        "assertUpgradeNotPending",
        params
      );
    },
    assertUpgradeDelayElapsed: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"assertUpgradeDelayElapsed">
    ): Promise<
      ProfileTrackerTypes.SignExecuteMethodResult<"assertUpgradeDelayElapsed">
    > => {
      return signExecuteMethod(
        ProfileTracker,
        this,
        "assertUpgradeDelayElapsed",
        params
      );
    },
    manageProfileSelf: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"manageProfileSelf">
    ): Promise<
      ProfileTrackerTypes.SignExecuteMethodResult<"manageProfileSelf">
    > => {
      return signExecuteMethod(
        ProfileTracker,
        this,
        "manageProfileSelf",
        params
      );
    },
    manageProfileFromRouter: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"manageProfileFromRouter">
    ): Promise<
      ProfileTrackerTypes.SignExecuteMethodResult<"manageProfileFromRouter">
    > => {
      return signExecuteMethod(
        ProfileTracker,
        this,
        "manageProfileFromRouter",
        params
      );
    },
    increaseXP: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"increaseXP">
    ): Promise<ProfileTrackerTypes.SignExecuteMethodResult<"increaseXP">> => {
      return signExecuteMethod(ProfileTracker, this, "increaseXP", params);
    },
    rewardReferrer: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"rewardReferrer">
    ): Promise<
      ProfileTrackerTypes.SignExecuteMethodResult<"rewardReferrer">
    > => {
      return signExecuteMethod(ProfileTracker, this, "rewardReferrer", params);
    },
    loadUserProfile: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"loadUserProfile">
    ): Promise<
      ProfileTrackerTypes.SignExecuteMethodResult<"loadUserProfile">
    > => {
      return signExecuteMethod(ProfileTracker, this, "loadUserProfile", params);
    },
    updateRouterAddress: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"updateRouterAddress">
    ): Promise<
      ProfileTrackerTypes.SignExecuteMethodResult<"updateRouterAddress">
    > => {
      return signExecuteMethod(
        ProfileTracker,
        this,
        "updateRouterAddress",
        params
      );
    },
    updateReferralSettings: async (
      params: ProfileTrackerTypes.SignExecuteMethodParams<"updateReferralSettings">
    ): Promise<
      ProfileTrackerTypes.SignExecuteMethodResult<"updateReferralSettings">
    > => {
      return signExecuteMethod(
        ProfileTracker,
        this,
        "updateReferralSettings",
        params
      );
    },
  };

  async multicall<Calls extends ProfileTrackerTypes.MultiCallParams>(
    calls: Calls
  ): Promise<ProfileTrackerTypes.MultiCallResults<Calls>>;
  async multicall<Callss extends ProfileTrackerTypes.MultiCallParams[]>(
    callss: Narrow<Callss>
  ): Promise<ProfileTrackerTypes.MulticallReturnType<Callss>>;
  async multicall<
    Callss extends
      | ProfileTrackerTypes.MultiCallParams
      | ProfileTrackerTypes.MultiCallParams[]
  >(callss: Callss): Promise<unknown> {
    return await multicallMethods(
      ProfileTracker,
      this,
      callss,
      getContractByCodeHash
    );
  }
}
