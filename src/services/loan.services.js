import { DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT } from "@alephium/web3"
import { CreateLoan, CancelLoan, PayLoan, AcceptLoan, AddCollateral, RemoveCollateral, LiquidationLoan } from "../../artifacts/ts"


export const CreateLoanService = async (
    signerProvider,
    loanFactory,
    tokenRequested,
    tokenAmount,
    collateralToken,
    collateralAmount,
    interest,
    duration,
    canLiquidate,
    collateralOracle,
    tokenOracle
  ) => {
    return await CreateLoan.execute(signerProvider, {
      initialFields: {
          loanFactory: loanFactory,
          tokenRequested: tokenRequested,
          tokenAmount: BigInt(tokenAmount),
          tokenOracle: tokenOracle,
          collateralToken: collateralToken,
          collateralAmount: BigInt(collateralAmount),  
          collateralOracle: collateralOracle,
          interest: interest,
          duration: duration,
          canLiquidate: canLiquidate
      },
      attoAlphAmount: DUST_AMOUNT + (MINIMAL_CONTRACT_DEPOSIT * 2n),
      tokens: [{id: collateralToken, amount: BigInt(collateralAmount)}]
    })
}

export const AddCollateralService = async (
    signerProvider,
    loanFactory,
    loanId,
    collateralToken,
    collateralAmount,
    collateralOracle,
    tokenOracle
) => {
  return await AddCollateral.execute(signerProvider, {
    initialFields: {
      loanFactory: loanFactory,
      contractId: loanId,
      amount: BigInt(collateralAmount),
      tokenOracle: tokenOracle,
      collateralOracle: collateralOracle
    },
    attoAlphAmount: DUST_AMOUNT * 2n,
    tokens: [{id: collateralToken, amount: BigInt(collateralAmount)}]
  })
}

export const RemoveCollateralService = async (
    signerProvider,
    loanFactory,
    loanId,
    collateralAmount,
    collateralOracle,
    tokenOracle
) => {
  return await RemoveCollateral.execute(signerProvider, {
    initialFields: {
      loanFactory: loanFactory,
      contractId: loanId,
      amount: BigInt(collateralAmount),
      tokenOracle: tokenOracle,
      collateralOracle: collateralOracle
    },
    attoAlphAmount: DUST_AMOUNT * 2n
  })
}

export const LiquidateLoanService = async (
    signerProvider,
    loanFactory,
    loanId,
    collateralOracle,
    tokenOracle
) => {
  return await LiquidationLoan.execute(signerProvider, {
    initialFields: {
      loanFactory: loanFactory,
      contract: loanId,
      tokenOracle: tokenOracle,
      collateralOracle: collateralOracle
    },
    attoAlphAmount: DUST_AMOUNT * 2n
  })
}

export const CancelLoanService = async (
    signerProvider,
    loanFactory,
    contractId
  ) => {
    return await CancelLoan.execute(signerProvider, {
      initialFields: {
        loanFactory: loanFactory,
        contract: contractId
    },
    attoAlphAmount: DUST_AMOUNT * 2n,
    })
}

export const PayLoanService = async (
    signerProvider,
    loanFactory,
    loanId,
    tokenId,
    amount
  ) => {
    return await PayLoan.execute(signerProvider, {
        initialFields: {
            loanFactory: loanFactory,
            contract: loanId
        },
        attoAlphAmount: (DUST_AMOUNT * 2n),
        tokens: [
            {
                tokenId: tokenId,
                amount: BigInt(amount)
            }
        ]
    })
}

export const AcceptLoanService = async (
    signerProvider,
    loanFactory,
    contractId,
    tokenId,
    amount,
    tokenOracle,
    collateralOracle
  ) => {
    return await AcceptLoan.execute(signerProvider, {
      initialFields: {
          loanFactory: loanFactory,
          contract: contractId,
          tokenOracle: tokenOracle,
          collateralOracle: collateralOracle
      },
      attoAlphAmount: (DUST_AMOUNT * 2n ),
      tokens: [{id: tokenId, amount: BigInt(amount)}]
    })
}