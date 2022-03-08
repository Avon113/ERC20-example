import React, { Component } from "react";
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KycContract from "./contracts/KycContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { loaded: false, kycAddress: "0x123",tokenSaleAddress: "", userTokens: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();
      // this.web3.accounts.privateKeyToAccount()

      // Get the contract instance.
      this.networkId = await this.web3.eth.getChainId();

      this.myToken = new this.web3.eth.Contract(
          MyToken.abi,
          MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      const totalSupply = await this.myToken.methods.balanceOf('0x778779587228B82CF282ce15963942cb81490635').call();
      console.log(totalSupply)

      this.myTokenSale = new this.web3.eth.Contract(
          MyTokenSale.abi,
          MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      this.kycContract = new this.web3.eth.Contract(
          KycContract.abi,
          KycContract.networks[this.networkId] && KycContract.networks[this.networkId].address,
      );
      // console.log(this.kycContract.methods)
      // const owner = await this.kycContract.methods.owner().call();
      // console.log(1)
      // this.isOwner = this.accounts[0] === owner

      this.isOwner = true


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      await this.listenToTokenTransfer();
      this.setState({ loaded:true, tokenSaleAddress: this.myTokenSale._address }, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  updateUserTokens = async() => {
    let userTokens = await this.myToken.methods.balanceOf(this.accounts[0]).call();
    this.setState({userTokens: userTokens});
  }

  listenToTokenTransfer = async() => {
    this.myToken.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
  }

  test = async () => {
    const token = await this.myToken.methods.balanceOf(MyToken.networks[this.networkId].address).call()
    console.log(token)
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }


  handleKycSubmit = async () => {
    const {kycAddress} = this.state;

    try {
      const isKycCompleted = await this.kycContract.methods.kycCompleted(kycAddress).call();
      if(isKycCompleted) {
        alert(`whitelist have address ${kycAddress} already!! `)
        return
      }
      await this.kycContract.methods.setKycCompleted(kycAddress).send({from: this.accounts[0]});
      alert("Account "+kycAddress+" is now whitelisted");
    } catch (err) {
      console.log(err)
    }

  }

  handleBuyToken = async () => {
    const trans = await this.myTokenSale.methods.buyTokens(this.accounts[0]).send({from: this.accounts[0], value: 1});
    console.log(trans);
    alert("buy successfully")
  }


  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
        <div className="App">
            <h1>Garu Token Example</h1>

            <h2>Enable your account</h2>
            Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange} />
            <button type="button" onClick={this.handleKycSubmit} disabled={ !this.isOwner }>Add Address to Whitelist</button>
            <button onClick={this.test}>Test</button>
          <h2>Buy Garu Tokens</h2>
          <p>Send ether to this address: {this.state.tokenSaleAddress}</p>
          <p>You have: {this.state.userTokens}</p>
          <button type="button" onClick={this.handleBuyToken}>Buy more tokens</button>
        </div>
    );
  }
}

export default App;
