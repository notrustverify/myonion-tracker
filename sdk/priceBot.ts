import { NodeProvider } from "@alephium/web3";

let node = new NodeProvider("https://node.alphaga.app");

// List of ALPH/TOKEN pools and their decimals
let pools: [string, number, number, string][] = [
    ["27Ub32AhfC9ULKGKGUTdDGU2ehvUN55aLS4oU8nmW3x9M", 18, 1, "Elexium"], // ALPH / EX pool
    // Add more ALPH/TOKEN pools here, format: ["POOL_ADDRESS", TOKEN_DECIMALS]
];

// oracle mapping address for token price comparison
// [address, pair, price] // <mapping_addy> | <pair> | <price>
let oracle_values: [string, string, number][] = [
    //[""]
]

// Function to get ALPH price in USD from the ALPH/USDT pool
async function getAlphPrice() {
    try {
        let assets = await node.contracts.getContractsAddressState("zVRuf1edCyysNDy5nSXEdNcrCJCehfMVpD6kcWqDd9fd"); // ALPH/USDT pool

        if (!assets || !assets.asset) throw new Error("Invalid contract state response.");

        let alphReserve = BigInt(assets.asset.attoAlphAmount ?? 0);
        let usdtReserve = assets.asset.tokens?.[0]?.amount ? BigInt(assets.asset.tokens[0].amount) : 0n;

        if (alphReserve === 0n) throw new Error("ALPH reserve is zero, cannot calculate price.");

        let adjustedUsdtReserve = usdtReserve * 10n ** 12n; // Scale USDT up to 18 decimals
        let alphPrice = Number(adjustedUsdtReserve) / Number(alphReserve);

        console.log(`ALPH Price: ${alphPrice.toFixed(6)} USDT`);
        return alphPrice;
    } catch (error) {
        console.error("Error fetching ALPH price:", error);
        return null;
    }
}

// Function to get token price in USD from ALPH/TOKEN pool
async function getTokenPrice(
    poolAddress: string, 
    tokenDecimals: number, 
    alphPrice: number, 
    tokenInContract: number,
    token: string
) {
    try {
        let assets = await node.contracts.getContractsAddressState(poolAddress);

        if (!assets || !assets.asset) throw new Error("Invalid contract state response.");

        let alphReserve = BigInt(assets.asset.attoAlphAmount ?? 0);
        let tokenReserve = assets.asset.tokens?.[tokenInContract]?.amount ? BigInt(assets.asset.tokens[tokenInContract].amount) : 0n;

        if (alphReserve === 0n || tokenReserve === 0n) throw new Error("Invalid reserves, cannot calculate price.");

        let adjustedTokenReserve = tokenReserve * 10n ** BigInt(18 - tokenDecimals); // Normalize decimals
        let tokenPriceInAlph = Number(alphReserve) / Number(adjustedTokenReserve);
        let tokenPriceInUsd = tokenPriceInAlph * alphPrice;

        console.log(`${token} (${poolAddress}) Price: ${tokenPriceInUsd.toFixed(6)} USDT`);
        return tokenPriceInUsd;
    } catch (error) {
        console.error(`Error fetching token price from pool ${poolAddress}:`, error);
        return null;
    }
}

// Main function to loop through token list and get prices
async function main() {
    while (true) {
        let alphPrice = await getAlphPrice();
        if (!alphPrice) {
            console.log("Skipping token price calculation due to missing ALPH price.");
            await sleep(60);
            continue;
        }

        for (let i = 0; i < pools.length; i++) {
            let [poolAddress, tokenDecimals, tokenInContract, token] = pools[i] as [string, number, number, string];
            await getTokenPrice(poolAddress, tokenDecimals, alphPrice, tokenInContract, token);
        }

        console.log("Sleeping for 60 seconds...");
        await sleep(60);
    }
}

// Sleep function
function sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

// Start the loop
main();