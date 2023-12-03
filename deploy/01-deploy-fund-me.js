

//import
//main function 
//calling of the main function


//hardhat deploy is little bit different
//we are still to import our libraries and package but we are not going to have main function and we are also not going to call the main function 
// when we run hardhat deeploy hardhat deploy is actually going to a call function taht we specify in script 


/*
function deployfunc() {
    console.log("hi nitish")
}
module.exports.default=deployfunc

*/
//so instead of kind of kinding everything like this(upper bala) and definig the function name ,




const {networkConfig,developmentChains}=require("../helper-hardhat-config") 
const{network}=require("hardhat")
const { verify } = require("../utils/verify")
require("dotenv").config()


// we aare actulaly going to using a nameless  async function,we are going to make it an anoymous function 
// ye function or upper bala allmost same hi hai 
// next  is it pulls out the variables and function out of the HRE
//hre is the hardhat run time environment 
// when ever we run a deploy script hardhat deploy automatically call this function and just passes the hardhat object into it 
// for our scripts we are only going to use two variables from a hre  getnameaccounts,deployments
module.exports = async(hre)=> {
    const {getNamedAccounts,deployments}=hre 
    //so we are using this deployment object reason this deployment objects to get two function  those two function are going to be the deploy function and the log function
    // so we are grabbing  this new deploy function ,this new log function and we are grabbing this deployer accpunts from this weird get nameaccounts function 
    const{deploy,log}=deployments
    const{deployer}=await getNamedAccounts()
    const chainId=network.config.chainId 

    // well what happens when we want to change  chains?
    //when going for localhost or hardhat network we want to use a mock 
    // in order for us to deploy a contract we remember from our last section that we use the contract factory  
    // with hardhat deploy we can just use this deploy function  


    //if chainId is x use address y
    // if chainId is z use address A
     // const ethUsdPriceFeedAddress =networkConfig[chainId]["ethUsdPriceFeed"]

     let ethUsdPriceFeedAddress
     if (chainId == 11155111){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress =  ethUsdAggregator,address
     }
     else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdpriceFeed"]
    }
    
      // like this is how we  go to a test net and main net 
      // but what about a loacal network like hardhat 
      // so we modularized our code  and parameterize our code so that we are going top use the address based off of the cahin that we are on 
      //but what if  we use a cahin that does not even have a price address on it 
      // what  do we do there ?
      // this is where actually creat those  mock contract 
      // the idea of mock contract here is if the contract does not exit  we deploy a minimal version of it for our loacal testing 
      // and deploying mocks is technically a deploy script
      
      



    //and to enable this functionality we actually take a page out of the Aave github  so 
    // aaave is another protocol that on multiple chains and has to deploy thier code to multiple chains and work with multiple defferent address 
    const args =[ethUsdPriceFeedAddress]
    const fundMe =await deploy ("FundMe",{
        from:deployer,
        args:[args], // put price feed address
        log:true,
         // we need to wait if on a live network so we can verify properly
         waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`FundMe deployed at ${fundMe.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [args])
    }


    log("----------------------------")
      
}

module.exports.tags =["all","fundme"]







