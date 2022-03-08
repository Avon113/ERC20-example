const Token = artifacts.require("MyToken");
const chai = require("./chaisetup");
const path = require("path");
const { expect } = chai
const BN = web3.utils.BN;
require('dotenv').config({
    path: path.resolve(__dirname, '../client', ".env")
});

contract("Token Test", async accounts => {
    const [initialHolder, recipient, anotherAccount] = accounts;

    beforeEach(async () => {
        this.myToken =  await Token.new(process.env.INITIAL_TOKENS);
        // console.log(initialHolder, "initial Holder")
        // console.log(recipient, "recipient")
    })

    it("all tokens should be in my account", async () => {
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        console.log(web3.utils.fromWei(totalSupply, "wei"), "total supply")
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
    })

    it("I can send tokens from Account 1 to Account 2", async () => {
        const sendTokens = 1;
        let instance = this.myToken;
        let totalSupply = await instance.totalSupply();
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
        await expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    });


    it("It's not possible to send more tokens than account 1 has", async () => {
        let instance = await Token.deployed();
        let balanceOfAccount = await instance.balanceOf(initialHolder);
        await expect(instance.transfer(recipient, new BN(balanceOfAccount+1))).to.eventually.be.rejected;

        //check if the balance is still the same
        return expect(instance.balanceOf(initialHolder)).to.eventually.be.a.bignumber.equal(balanceOfAccount);

    });

})