/** 
 *  Set the provider you want from Web3.providers
 *  @return {Object} web3
 */
function setWeb3Provider() {
    if (typeof web3 !== 'undefined')
        web3 = new Web3(web3.currentProvider);
    else
        web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/1u84gV2YFYHHTTnh8uVl"));

    return web3;
}


setWeb3Provider();