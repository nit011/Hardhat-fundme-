// now we did test previously in our last section  but our test here are going to look a little bit differently   we are actullay going to use hardhat deploy tpo automatically set up our tests as if both of these deployed function had been run 

// we can group our test based off different function so lets have our first set of tests be around our constructor 




// we are going to deploy fund me  where we are going to deploy our dund me contract is first by pilling in our deployment object from hardhat 
const{deployments,ethers,getNameAccounts}=require("hardhat")
const {assert,expect}=require("chai")


// this larger scope will be for the entire fully contract 
describe("FundMe",async function(){


    // since we use hardhat deploy  our fund me contract will come even with our  mocks and everything  so above the before each lets do let fundme 
     let fundMe
     let deployer
     let MockV3Aggregator
     const sendValue =ethers.utils.parseEther("1")//1eth   
     beforeEach(async function(){
        //deploy our fundMe contract 
        //using hardhat deploy 


        // now we are going to make a bunch  of transaction  on our fundme ,to test it ofcourse we can also tell ethers which accounts we want connected to fund me 
        deployer=(await getNameAccounts()).deployer

        //and deployments  object has has a finction called fixture with fixture does is it allow us to bassically run  our entire deploy folder  with as many tags as we wants  
        // its means that in this deployments stuff fixtures its goona be await deployment dot fixture 
        // if i run away deployment dot fixture  i will run through our deploy scripts on our loacal network and deploy all of the contract that we can use them in our scripts and inour testing 
        // and we can deploy everything in that deploy folder with just this one line 
        //await depployment.fixture(["all"]) 
        await deployments.fixture(["all"])


        //now all of our contract have been deployed we can start getting them 
        //hardhat deploy rapt ether is with A  function called getcontract
        // this get contract function is going to get the most recent deployment of whaever contract we tell it .
        // so its gave us  the mmost recentily deployed fundme contract in just this one line 
        // and now what we can do is we can connect our deployer to our fund me account 
        //so whenever we call a function with fund me   it will automactically be from that the deployer account 
        fundMe= await ethers.getContract("fundMe",deployer)
        MockV3Aggregator =  await ethers.getContract("MockV3Aggregator",deployer)
     })

     describe("constructor", function () {
        it("sets the aggregator addresses correctly", async () => {
            const response = await fundMe.getPriceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", function () {
        // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
        // could also do assert.fail
        it("Fails if you don't send enough ETH", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!"
            )
        })
        // we could be even more precise here by making sure exactly $50 works
        // but this is good enough for now
        it("Updates the amount funded data structure", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getAddressToAmountFunded(
                deployer
            )
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getFunder(0)
            assert.equal(response, deployer)
        })
    })
    describe("withdraw", function () {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })
        it("withdraws ETH from a single funder", async () => {
            // Arrange
            const startingFundMeBalance =
                await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance =
                await fundMe.provider.getBalance(deployer)

            // Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait()
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance =
                await fundMe.provider.getBalance(deployer)

            // Assert
            // Maybe clean up to understand the testing
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                startingFundMeBalance
                    .add(startingDeployerBalance)
                    .toString(),
                endingDeployerBalance.add(gasCost).toString()
            )
        })
        // this test is overloaded. Ideally we'd split it into multiple tests
        // but for simplicity we left it as one
        it("is allows us to withdraw with multiple funders", async () => {
            // Arrange
            const accounts = await ethers.getSigners()
            for (i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }
            const startingFundMeBalance =
                await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance =
                await fundMe.provider.getBalance(deployer)

            // Act
            const transactionResponse = await fundMe.cheaperWithdraw()
            // Let's comapre gas costs :)
            // const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait()
            const { gasUsed, effectiveGasPrice } = transactionReceipt
            const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
            console.log(`GasCost: ${withdrawGasCost}`)
            console.log(`GasUsed: ${gasUsed}`)
            console.log(`GasPrice: ${effectiveGasPrice}`)
            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )
            const endingDeployerBalance =
                await fundMe.provider.getBalance(deployer)
            // Assert
            assert.equal(
                startingFundMeBalance
                    .add(startingDeployerBalance)
                    .toString(),
                endingDeployerBalance.add(withdrawGasCost).toString()
            )
            // Make a getter for storage variables
            await expect(fundMe.getFunder(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getAddressToAmountFunded(
                        accounts[i].address
                    ),
                    0
                )
            }
        })
        it("Only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            const fundMeConnectedContract = await fundMe.connect(
                accounts[1]
            )
            await expect(
                fundMeConnectedContract.withdraw()
            ).to.be.revertedWith("FundMe__NotOwner")
        })
    })



})