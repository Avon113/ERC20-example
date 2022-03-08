const path = require('path');
const fs = require('fs');
require('dotenv').config({
  path: path.resolve(__dirname, '../client', ".env")
});

var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSales = artifacts.require("./MyTokenSale.sol");
var KycContract = artifacts.require("./KycContract.sol");

module.exports = async function(deployer) {
  let addr = await web3.eth.getAccounts();
  // console.log(process.env.INITIAL_TOKENS, 'INITIAL TOKEN');
  await deployer.deploy(MyToken, process.env.INITIAL_TOKENS);
  await deployer.deploy(KycContract);
  await deployer.deploy(MyTokenSales, 1, addr[0], MyToken.address, KycContract.address);
  let tokenInstance = await MyToken.deployed();
  await tokenInstance.transfer(MyTokenSales.address, process.env.INITIAL_TOKENS);

  const addressOfContracts = {
    MY_TOKEN_SALES: MyTokenSales.address,
    MY_TOKEN: MyToken.address,
    KYC: KycContract.address
  }

  const pathFile = path.resolve(__dirname, '../client', 'contractAddress.json')
  fs.writeFile(pathFile, JSON.stringify(addressOfContracts), (err) => {
    if(err)
      console.log(err)
  })
};
