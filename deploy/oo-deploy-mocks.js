 /*
 
 
 // we start with 00 .
 // bcz this  is almost like the pre deploy stuff
 // we only do this sometimes we donts always deploy  mocks 
 
// we dont need to deploy mocks to seoplia or polygon or etehrium main net because those already have these price feeds


const{network} = require("hardhat")
const{developmentChains,DECIMALS,INITIAL_ANSWER}=require("../helper-hardhat-config")



module.exports = async(hre)=> {
    const {getNamedAccounts,deployments}=hre 
    const{deploy,log}=deployments
    const{deployer}=await getNamedAccounts()
    const chainId=network.config.chainId 

    if (chainId == 11155111){
        log("Local network detected deploying mocks..")
        await deploy("MockV3Aggregator",{
            contract:"MockV3Aggregator",
            from:deployer,
            log:true,
            args:[DECIMALS,INITIAL_ANSWER]
        })
        log("mocks deployed")
        log("_________________________________________________________")
    }
}



module.exports.tags=["all","mocks"]

*/



const { network } = require("hardhat")

const DECIMALS = "8"
const INITIAL_PRICE = "200000000000" // 2000
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    // If we are on a local development network, we need to deploy mocks!
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        log("Mocks Deployed!")
        log("------------------------------------------------")
        log(
            "You are deploying to a local network, you'll need a local network running to interact"
        )
        log(
            "Please run `npx hardhat console` to interact with the deployed smart contracts!"
        )
        log("------------------------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]