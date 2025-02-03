const { NodeWallet, PrivateKeyWallet } = require("@alephium/web3-wallet")
const { web3 } = require("@alephium/web3")

web3.setCurrentNodeProvider("https://wallet-v20.mainnet.alephium.org")

const wallet =  new PrivateKeyWallet({privateKey: '2f2d421d6a642ba631aa304973d21c641dde9abe47a9195b85d8ca517de00cd6', keyType: undefined, nodeProvider: web3.getCurrentNodeProvider()})

// ensuring the address existed since i was at work and the explorer is blocked, thanks github codespaces
console.log(wallet.account)

// Transfer 150 ALPH to address
async function sendALPH() {
    await wallet.signAndSubmitTransferTx({
    signerAddress: wallet.account.address,
        destinations: [{
        address: '1EgpiwGXZd7Mvq4MF8zWJVF436aBBkhFc8pv1Sxs2QjK2',
        attoAlphAmount: 150000000000000000000 // 150 alph times plus 18 decimal places
    }]
    })
}

sendALPH() // bam, we send the alph!