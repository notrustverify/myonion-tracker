import { DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT } from "@alephium/web3"
import { CreateLoan, CancelLoan, PayLoan, AcceptLoan, AddFunds } from "../../artifacts/ts"

export const CreateLoanService = async (
    signerProvider,
    loanFactory,
    tokenRequested,
    tokenAmount,
    collateralToken,
    collateralAmount,
    interest,
    duration,
    canLiquidate
  ) => {
    return await CreateLoan.execute(signerProvider, {
      initialFields: {
          loanFactory: loanFactory,
          tokenRequested: tokenRequested,
          tokenAmount: tokenAmount,
          tokenOracle: true,
          collateralToken: collateralToken,
          collateralAmount: collateralAmount,  
          collateralOracle: true,
          interest: interest,
          duration: duration,
          canLiquidate: canLiquidate
      },
      attoAlphAmount: DUST_AMOUNT + (MINIMAL_CONTRACT_DEPOSIT * 2n),
      tokens: [{id: collateralToken, amount: collateralAmount}]
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
        attoAlphAmount: (DUST_AMOUNT * 2n) + MINIMAL_CONTRACT_DEPOSIT,
        tokens: [
            {
                tokenId: tokenId,
                amount: amount
            }
        ]
    })
}

export const AcceptLoanService = async (
    signerProvider,
    loanFactory,
    contractId,
    tokenId,
    amount
  ) => {
    return await AcceptLoan.execute(signerProvider, {
      initialFields: {
          loanFactory: loanFactory,
          contract: contractId,
          tokenOracle: true,
          collateralOracle: true
      },
      attoAlphAmount: DUST_AMOUNT + (MINIMAL_CONTRACT_DEPOSIT * 2n),
      tokens: [{id: tokenId, amount: amount}]
    })
}