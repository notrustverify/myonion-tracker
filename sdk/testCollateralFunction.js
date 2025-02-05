const { ONE_ALPH } = require("@alephium/web3");

function determineCollateralRatioJS(
    tokenRequested,
    tokenAmount,
    collateralToken, 
    collateralAmount,
    threshold
) {
    // alph values
    let loanValue = 66059297
    let collateralValue = 66059297

    let collateralDecimals = 18
    let tokenDecimalsVal = 18

    // Normalize collateral amount to 18 decimals
    let collateralNormalized = (collateralAmount * (10 ** 18)) / (10 ** collateralDecimals);
    let collateralValueUSD = (collateralNormalized * collateralValue) / (10 ** 8); // Remove 8 decimals

    // Normalize loan amount to 18 decimals
    let loanNormalized = (tokenAmount * (10 ** 18)) / (10 ** tokenDecimalsVal);
    let loanValueUSD = (loanNormalized * loanValue) / (10 ** 8); // Remove 8 decimals

    // Compute collateral-to-loan ratio in basis points (10000 = 100%)
    let ratio = (collateralValueUSD * 10000) / loanValueUSD; // Multiplication before division to prevent rounding errors

    let underCollateralized = ratio < threshold;

    return { ratio, underCollateralized };
}

let ratio, underCollateralized = determineCollateralRatioJS(
    "ALPH",
    1000000000000000000,
    "ALPH",
    2000000000000000000,
    15000
)

console.log(ratio, underCollateralized)