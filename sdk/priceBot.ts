import { Deployer, DeployFunction, Network } from "@alephium/cli";
import { DUST_AMOUNT, NodeProvider, stringToHex } from "@alephium/web3";
import { Settings } from "../alephium.config";
import { getNetwork } from "../scripts/network";
import { UpdatePair } from "../artifacts/ts";
import { PrivateKeyWallet } from '@alephium/web3-wallet'

let node = new NodeProvider("https://node.alphaga.app");

// insert private key here / bot address that updates script

// const Signer = new PrivateKeyWallet({ privateKey:  })


// List of ALPH/TOKEN pools and their decimals
let pools: [string, number, number, string][] = [
    ["27Ub32AhfC9ULKGKGUTdDGU2ehvUN55aLS4oU8nmW3x9M", 18, 1, "Elexium"], // ALPH / EX pool
    ["vX4iFtkRjPWpyUFiHBDmtq8FETxbMUD7Y8W37xfnAU7Z", 18, 0, "AlphPad"], // ALPH / APAD pool
    ["25ywM8iGxKpZWuGA5z6DXKGcZCXtPBmnbQyJEsjvjjWTy", 18, 1, "Ayin"]
    // Add more ALPH/TOKEN pools here, format: ["POOL_ADDRESS", TOKEN_DECIMALS]
];

// oracle mapping address for token price comparison
// [address, pair, price] // <mapping_addy> | <pair> | <price>
let oracle_values: [string, string, number][] = [
    ["29jag3ovmVhEfGbxvtxrwZfVSm9uwmCz38gGfj14KAs7u", "EX/USD", 0]
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

        console.log(`${token} (${poolAddress}) Price: ${tokenPriceInUsd.toFixed(8)} USDT`);
        return tokenPriceInUsd;
    } catch (error) {
        console.error(`Error fetching token price from pool ${poolAddress}:`, error);
        return null;
    }
}

// function call to contract
/*
async function updatePair(pair: string, price: bigint) {
    const deployScript: DeployFunction<Settings> = async (
        deployer: Deployer,
        network: Network<Settings>
      ): Promise<void> => {
        const upgradeNetwork = getNetwork()
        
        let tx = await UpdatePair.execute(Signer, {
          initialFields: {
              oracle: "79b75a922382f264422a1a4a7a874ee63340ab703612b5ade24b1324176f0b00",
              pair: stringToHex(pair),
              price: price
          },
          attoAlphAmount: DUST_AMOUNT
        })

        console.log(`${pair}: Update Sent To Chain: ${tx.txId}`)
      }
}
*/

// oracle address, incoming price
async function updateAlpacaFiPair(oracleAddress: string, newPrice: bigint, oracleIndex: number) {
    try {
        let state = await node.contracts.getContractsAddressState(oracleAddress);

        if (!state || !state.mutFields || !state.mutFields[0].value) {
            console.error(`Failed to retrieve existing price for ${oracleAddress}`);
            return;
        }

        let lastPrice = BigInt(Number(state.mutFields[0].value)); // Fetch last recorded price
        console.log(`Previous Price: ${lastPrice}, New Price: ${newPrice}`);

        // Calculate percentage change
        let priceDiff = newPrice > lastPrice ? newPrice - lastPrice : lastPrice - newPrice;
        let percentageChange = (Number(priceDiff) / Number(lastPrice)) * 100;

        console.log(`Price Change: ${percentageChange.toFixed(2)}%`);

        // Only update if price change is greater than ±5%
        if (percentageChange > 5) {
            console.log(`Updating price for ${oracle_values[oracleIndex][1]} as the change is above 5%`);
            // Call contract update function here
            await updatePair(oracle_values[oracleIndex][1], newPrice)
        } else {
            console.log("No significant price change. Skipping update.");
        }
    } catch (error) {
        console.error(`Error updating oracle for ${oracle_values[oracleIndex][1]}:`, error);
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
            let tokenPrice = await getTokenPrice(poolAddress, tokenDecimals, alphPrice, tokenInContract, token);
            if (i < oracle_values.length) {
                let [address, pair, price] = oracle_values[i] as [string, string, number];
                
                // Ensure tokenPrice is a valid number
                if (tokenPrice !== null && !isNaN(tokenPrice)) {
                    let scaledPrice = BigInt(Math.round(tokenPrice * 10 ** 8)); // Scale to 18 decimals
                    updateAlpacaFiPair(address, scaledPrice, i);
                } else {
                    console.error(`Invalid token price for ${pair}, skipping update.`);
                }
            }                    
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