import { DUST_AMOUNT, MINIMAL_CONTRACT_DEPOSIT } from "@alephium/web3"
import { CreateLoan, CancelLoan, PayLoan, AcceptLoan, AddCollateral, RemoveCollateral, LiquidationLoan, ForfeitLoan, Bid, Redeem } from "../../artifacts/ts"

export const newLoan = async (
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
          tokenAmount: BigInt(tokenAmount),
          collateralToken: collateralToken,
          collateralAmount: BigInt(collateralAmount),
          interest: interest,
          duration: duration,
          canLiquidate: canLiquidate
      },
      attoAlphAmount: DUST_AMOUNT + (MINIMAL_CONTRACT_DEPOSIT * 3n),
      tokens: [{id: collateralToken, amount: BigInt(collateralAmount)}]
    })
}

export const BidAuctionService = async (
    signerProvider,
    auctionFactory,
    auctionId,
    tokenId,
    amount
) => {
  return await Bid.execute(signerProvider, {
    initialFields: {
      contract: auctionFactory,
      id: auctionId,  
      token: tokenId,
      amount: BigInt(amount)
    },
    attoAlphAmount: DUST_AMOUNT * 2n,
    tokens: [{id: tokenId, amount: BigInt(amount)}]
  })
}

export const RedeemAuctionService = async (
    signerProvider,
    auctionFactory,
    auctionId,
) => {
  return await Redeem.execute(signerProvider, {
    initialFields: {
      contract: auctionFactory,
      id: auctionId
    },
    attoAlphAmount: DUST_AMOUNT * 2n
  })
} 

export const AddCollateralService = async (
    signerProvider,
    loanFactory,
    loanId,
    collateralToken,
    collateralAmount,
) => {
  return await AddCollateral.execute(signerProvider, {
    initialFields: {
      loanFactory: loanFactory,
      contractId: loanId,
      amount: BigInt(collateralAmount),
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
) => {
  return await RemoveCollateral.execute(signerProvider, {
    initialFields: {
      loanFactory: loanFactory,
      contractId: loanId,
      amount: BigInt(collateralAmount),
    },
    attoAlphAmount: DUST_AMOUNT * 2n
  })
}

export const LiquidateLoanService = async (
    signerProvider,
    loanFactory,
    loanId,
) => {
  return await LiquidationLoan.execute(signerProvider, {
    initialFields: {
      loanFactory: loanFactory,
      contract: loanId,
    },
    attoAlphAmount: DUST_AMOUNT * 2n
  })
}

export const ForfeitLoanService = async (
    signerProvider,
    loanFactory,
    loanId
) => {
  return await ForfeitLoan.execute(signerProvider, {
    initialFields: {
      loanFactory: loanFactory,
      contract: loanId
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

export const PayLoanService = async (signerProvider, loanFactory, loanId, tokenId, amount) => {
  return await PayLoan.execute(signerProvider, {
    initialFields: {
      loanFactory: loanFactory,
      contract: loanId
    },
    attoAlphAmount: DUST_AMOUNT + (MINIMAL_CONTRACT_DEPOSIT * 2n),
    tokens: [{id: tokenId, amount: BigInt(amount)}]
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
      },
      attoAlphAmount: (DUST_AMOUNT * 2n ),
      tokens: [{id: tokenId, amount: BigInt(amount)}]
    })
}