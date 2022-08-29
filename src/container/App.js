import React, { Component } from "react";
import { connect } from "react-redux";
import { Switch, Route } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Modal from "../components/Modal/Modal";
import Navigate from "../components/Navigate/Navigate";
import Index from "../components/Index/Index";
import Token from "../components/Token/Token";
import Account from "../components/Account/Account";
import { initializeWeb3, connectWallet } from "../utils/contract";
import Web3 from "web3";
import { FACTORY_ADDRESS, CONTRACT_ABI } from "../config";
import FormCard from "../components/FormCard/FormCard";
import store from "../store/store";
import Pagination from "@material-ui/lab/Pagination";
import { Grid, CircularProgress } from "@material-ui/core";
import Message from "../components/Dialog/message";
import { mainAbi, mainContractAddress } from "../utils/data";

class App extends Component {
  constructor() {
    super();
    this.state = {
      address: "",
      isCreateFarmModalOpen: false,
      web3: null,
      contract: null,
      farmLength: null,
      showLoader: true,
      currentPage: 1,
      modalType: 0,
    };
  }

  loadWeb3 = async () => {
    let isConnected = false;
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();

        isConnected = true;
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        isConnected = true;
      } else {
        isConnected = false;
        // let obj = {
        //   show: true,
        //   severity: "error",
        //   message:
        //     "Metamask is not installed, please install it on your browser to connect.",
        // };
        // setMessage(obj);
        //  showAlert(
        //   "Whoops...",
        //   "<p className='txtAlert'>Metamask is not installed, please install it on your browser to connect.</p><a target='_blank' href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'>https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en</a>"
        // );
      }
      if (isConnected === true) {
        const web3 = window.web3;

        let accountDetails = null;
        window.ethereum.on("accountsChanged", function (accounts) {
          store.dispatch({
            type: "SET_MAIN_ACCOUNT",
            payload: { account: accounts[0], isSet: true },
          });
        });
        // accountDetails = await contract.methods.userData(accounts[0]).call();
        // setMainAccountDetails(accountDetails);

        // setMainAccountStake(
        //   parseFloat(
        //     web3.utils.fromWei(accountDetails.stakes, "ether")
        //   ).toFixed(3)
        // );

        // accountDetails?.deposit_time &&
        //   setRewardReady(
        //     moment(
        //       moment(
        //         new Date(accountDetails?.deposit_time * 1000).toISOString()
        //       ).add(7, "days")
        //     ).diff(moment(new Date().toISOString())) === 0
        //       ? true
        //       : false
        //   );
        // await getRewardOnInterval(contract, accounts[0]);
      }
    } catch (error) {
      // let obj = {
      //   show: true,
      //   severity: "error",
      //   message: "Error while connecting metamask",
      //   title: "Connecting Metamask",
      // };
      // setMessage(obj);
    }
  };
  farmAtIndex = async (index) => {
    const web3 = window.web3;

    const contract = new web3.eth.Contract(mainAbi, mainContractAddress, {
      gasLimit: 3000000,
    });
    try {
      const address = await contract.methods.farmAtIndex(index).call();
      return address;
    } catch (error) {
      return error;
    }
  };
  handleFechData = async (page, length) => {
    try {
      let arr = [];
      let newLength = Math.min(page * 7, length);
      let m = page * 7 - 7;
      for (let index = m; index < newLength; index++) {
        let address = await this.farmAtIndex(index);
        // http://api-kovan.etherscan.io/api?module=contract&action=getabi&address=0xd2ef721b4c5b9a6365b77e8a22aeb00b4d48f7ad&format=raw
        let response = await fetch(
          "https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=" +
            address +
            "&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
        );
        let response2 = await fetch(
          "https://api-kovan.etherscan.io/api?module=account&action=tokentx&address=" +
            address +
            "&startblock=0&endblock=999999999&sort=asc&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
          // "https://api-kovan.etherscan.io/api?module=contract&action=tokentx&address=" +
          //   address +
          //   "&startblock=0&endblock=999999999&sort=asc&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
        );

        let data2 = await response2.json();
        // tokenSymbol
        let cardName = data2?.result[0]?.tokenSymbol;

        // let abi2 = JSON.parse(data2.result);

        let data = await response.json();
        let abi = JSON.parse(data.result);
        const web3 = window.web3;
        const contract = new web3.eth.Contract(abi, address, {
          gasLimit: 3000000,
        });
        let detail = await contract.methods.farmInfo().call();
        let farmInfo = {
          lpToken: detail.lpToken,
          rewardToken: detail.rewardToken,
          startBlock: detail.startBlock,
          blockReward: web3.utils.fromWei(detail.blockReward, "ether"),
          bonusEndBlock: detail.bonusEndBlock,
          bonus: detail.bonus,
          endBlock: detail.endBlock,
          farmableSupply: web3.utils.fromWei(detail.farmableSupply),
          bonnumFarmersus: detail.numFarmers,
          address,
          cardName: cardName,
          indexAt: index,
        };

        arr.push(farmInfo);
      }
      return arr;
    } catch (error) {
      return "error";
    }
  };

  handleLoadData = async (page, length) => {
    this.setState({ showLoader: true });

    // const requestToFetch = await fetch(
    //   `http://localhost:4000/getFarmInfo?page=${page}`,
    //   {
    //     // Adding method type
    //     method: "POST",
    //   }
    // );
    const result = await this.handleFechData(page, length);
    // const { result } = await requestToFetch.json();

    store.dispatch({ type: "STORE_DATA", result });
    const web3 = window.web3;

    if (result !== "error" && result?.length > 0) {
      let response = await fetch(
        "https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=" +
          result[0].lpToken +
          "&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
      );

      let data = await response.json();
      let abi = JSON.parse(data?.result);

      let contract = new web3.eth.Contract(abi, result[0].lpToken, {
        gasLimit: 3000000,
      });
      let blnce = await contract.methods.balanceOf(result[0].lpToken).call();
      localStorage.setItem("balance", blnce);
      let b = parseFloat(web3.utils.fromWei(blnce, "ether")).toFixed(3);
      this.setState({ balance: b });
    }
    this.setState({ showLoader: false });
  };
  async componentDidMount() {
    // const fetchData = await fetch(`http://localhost:4000/getFarmLength`, {
    //   method: "POST",
    // });
    // const { result } = await fetchData.json();
    try {
      await initializeWeb3();
      const web3 = window.web3;

      let mainContract = new web3.eth.Contract(mainAbi, mainContractAddress, {
        gasLimit: 3000000,
      });

      const len = await mainContract.methods.farmsLength().call();

      this.setState({ farmLength: len });
      await this.handleLoadData(1, len);

      // tokenAddress instance
      // call decimal and approve (tokenAddress,ecpectedLiquidity*decimals)
    } catch (e) {
      console.log("error", e);
      this.setState({ showLoader: false });
    }
  }
  initWeb3 = async () => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(CONTRACT_ABI, FACTORY_ADDRESS);

    // web3.eth.getBalance(accounts[0], (err, balance) => {
    //   // set lance in state then hide card if balance is 0
    // console.log(balance)
    // });
    // let tokens = await contract.methods.balanceOf(FACTORY_ADDRESS).call();
    // console.log("tokens",tokens)

    store.dispatch({
      type: "SET_MAIN_ACCOUNT",
      payload: { account: accounts[0], isSet: true },
    });
    store.dispatch({
      type: "SET_CONTRACT",
      payload: { contract },
    });

    console.log("res2", "save dara ", accounts[0]);
    this.setState({ account: accounts[0], web3, contract });
  };

  metamask = async () => {
    const addr = await connectWallet();
    await this.initWeb3();
    await this.loadWeb3();
    this.setState({
      address: `${addr.slice(0, 7)}...${addr.slice(37, -1)}`,
      connected: true,
      modalType: 0,

      // isCreateFarmModalOpen: true,
    });
  };
  metamask2 = async () => {
    const addr = await connectWallet();
    await this.initWeb3();
    await this.loadWeb3();
    console.log(this.props.mainAccount ? false : true);
    this.setState({
      address: `${addr.slice(0, 7)}...${addr.slice(37, -1)}`,
      connected: true,
      modalType: 0,
      isCreateFarmModalOpen: true,
    });
  };
  metamask3 = async () => {
    this.setState({
      connected: true,
      modalType: 0,
      isCreateFarmModalOpen: true,
    });
  };

  handlePageChange = async (e, page) => {
    await this.handleLoadData(page, this.state.farmLength);
    this.setState({ currentPage: page });
  };
  handleChangeType = () => {
    this.setState({ modalType: 1 });
  };
  render() {
    const { farmsArray } = this.props;
    console.log("state=======", this.state);
    return (
      <div>
        <Message />

        <Index
          contract={this.props.contractInstance?.contract}
          account={this?.props?.mainAccount}
          onPopupClosed={() => {
            this.setState({ isCreateFarmModalOpen: false });
          }}
          loadContract={this.initWeb3}
          metamask={this.metamask3}
          mainAccountConnected={this?.props?.mainAccount}
          handleChangeType={this.handleChangeType}
          isCreateFarmModalOpen={this.state.isCreateFarmModalOpen}
        />

        <Modal
          metamask={this.state.modalType === 0 ? this.metamask : this.metamask2}
        />
        {window.location.origin + "/" === window.location.href &&
          window.location.pathname === "/" && (
            <>
              {this.state.showLoader ? (
                <Grid container justify="center">
                  <CircularProgress />
                </Grid>
              ) : (
                <>
                  {farmsArray?.length > 0 &&
                    Array.isArray(farmsArray) &&
                    farmsArray.map((data, index) => {
                      return (
                        <FormCard
                          key={index}
                          data={data}
                          accountAddress={this.state.account}
                        />
                      );
                    })}
                  {this.state.farmLength && (
                    <Grid
                      container
                      justify="center"
                      style={{ margin: "20px 0px" }}
                    >
                      <Pagination
                        page={this.state.currentPage}
                        style={{ marginBottom: "10px" }}
                        count={Math.ceil(this.state.farmLength / 7)}
                        onChange={this.handlePageChange}
                        variant="outlined"
                        shape="rounded"
                      />
                    </Grid>
                  )}
                </>
              )}
            </>
          )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    farmsArray: state.farmsArray,
    mainAccount: state.mainAccount,
    contractInstance: state.contractInstance,
  };
};

export default connect(mapStateToProps)(App);
