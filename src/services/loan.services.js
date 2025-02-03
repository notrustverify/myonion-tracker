import { DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT } from "@alephium/web3"
import { CreateLoan, CancelLoan, PayLoan, AcceptLoan } from "../../artifacts/ts"

export const CreateLoanService = async (
    signerProvider,
    loanFactory,
    tokenRequested,
    tokenAmount,
    collateralToken,
    collateralAmount,
    interest,
    duration,
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
        canLiquidate: false,
      },
      attoAlphAmount: MINIMAL_CONTRACT_DEPOSIT + DUST_AMOUNT * 2n,


      tokens: [
        {
          tokenId: collateralToken,
          amount: collateralAmount
        }
      ]
    })
}

export const CancelLoanService = async (
    signerProvider,
    loanFactory,
    loanId
  ) => {
    return await CancelLoan.execute(signerProvider, {
      initialFields: {
        loanFactory: loanFactory,
        contractId: loanId
    },
    attoAlphAmount: DUST_AMOUNT,
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
            contractId: loanId
        },
        attoAlphAmount: (DUST_AMOUNT * 2n) + MINIMAL_CONTRACT_DEPOSIT,
        tokens: [
            {
                tokenId: tokenId,
                amount: amount * 1e18
            }
        ]
    })
}

export const AcceptLoanService = async (
    signerProvider,
    loanFactory,
    loanId
  ) => {
    return await AcceptLoan.execute(signerProvider, {
        initialFields: {
            loanFactory: loanFactory,
            contractId: loanId,
            tokenOracle: true,
            collateralOracle: true,
        },
        attoAlphAmount: DUST_AMOUNT,

    })
}


