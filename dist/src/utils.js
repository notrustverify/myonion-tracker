"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenList = getTokenList;
exports.findTokenFromId = findTokenFromId;
function getNetwork() {
    const network = (process.env.NEXT_PUBLIC_NETWORK ?? 'mainnet');
    return network;
}
async function getTokenList() {
    const url = `https://raw.githubusercontent.com/alephium/token-list/master/tokens/${getNetwork()}.json`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.tokens;
}
function findTokenFromId(tokenList, tokenId) {
    return tokenList?.find((token) => token.id === tokenId);
}
