/*
// and this is where we are going to define that network config
// this is where we are going to say hey if yopu are network a use this address etc 
const networkConfig={
    11155111:{
        name:"sepolia",
        ethUsdpriceFeed:"0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"

    },
    137:{
        name:"polygon",
        ethUsdpriceFeed:"0xF9680D99D6C9589e2a93a78A04A279e509205945"
    }
}

const developmentChain=["hardhat","localhost"]
const DECIMALS=8
const INITIAL_ANSWER=200000000000

module.exports={
    networkConfig,
    developmentChain,
    DECIMALS,
    INITIAL_ANSWER
}

*/


const networkConfig = {
    31337: {
        name: "localhost",
    },
    // Price Feed Address, values can be obtained at https://docs.chain.link/data-feeds/price-feeds/addresses
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
