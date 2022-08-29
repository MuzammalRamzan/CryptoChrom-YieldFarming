import React, { useState, useEffect } from "react";
import Web3 from "web3";

import Header from "../components/Header";
import Card from "../components/Card";
import StackingCard from "../components/StackingCard";
import DepositeCard from "../components/DepositeCard";
import { Grid } from "@material-ui/core";
import { Snackbar } from "@material-ui/core";
// eslint-disable-next-line
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "../components/Dialog";
// eslint-disable-next-line
import { tokenabi, abi } from "./data";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import moment from "moment";
import { getTVLValue } from "./index(2)";
// eslint-disable-next-line
const NumberFormat = require("react-number-format");

function AlertComponent(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Home = (props) => {
  const [enteredAmount, setEnteredAmount] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [mainAccountDetails, setMainAccountDetails] = useState(null);
  const [mainAccountStake, setMainAccountStake] = useState(null);
  const [message, setMessage] = useState({
    show: false,
    severity: "",
    message: "",
    title: "",
  });
  const [showTimer, setShowTimer] = useState(false);
  const [dropMessage, setDropMessage] = useState("");
  const classes = useStyles();
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [rewardReady, setRewardReady] = useState(false);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleToggleBackdrop = () => {
    setOpenBackdrop(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setMessage({
      show: false,
      severity: "",
      message: "",
      title: "",
    });
    //hide here
  };
  // usdRate
  // eslint-disable-next-line
  const [state, setState] = useState({
    mainAccount: null,
    totalZinTokens: null,
    rewards: null,
    stakeOf: null,
  });
  const [openStakeDialog, setOpenStakeDialog] = useState(false);
  const handleCloseStake = () => {
    setOpenStakeDialog(false);
  };
  const handleOpenStake = () => {
    setOpenStakeDialog(true);
  };
  const [totalStakesAmount, setTotalStakeAmount] = useState(0);
  const [account, setAccount] = useState(null);
  const [usdRate, setUsdRate] = useState(null);
  let rev = null;
  // eslint-disable-next-line
  useEffect(async () => {
    await axios
      .get(
        "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,IOT&tsyms=USD"
      )
      .then((res) => {
        const cryptos = res.data;
        console.log(cryptos["ETH"].USD);
        setUsdRate(cryptos["ETH"].USD);
      });
  }, []);
  // "0x1806D174f365a31a3A9705d60bdd7D4522bD16EC"
  // eslint-disable-next-line
  const [contractAddress, setContractAddress] = useState(
    // "0xafb8Dea6b90ac3b494406F2a1c8aa867283a66E2"
    "0xafb8Dea6b90ac3b494406F2a1c8aa867283a66E2"
  );
  // eslint-disable-next-line
  const [tokenAddress, setTokenAddress] = useState(
    "0x56B6dB07880276F8D7E259d070b0429De5483D55"
  );

  const loadWeb3 = async () => {
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
        let obj = {
          show: true,
          severity: "error",
          message:
            "Metamask is not installed, please install it on your browser to connect.",
        };
        setMessage(obj);
        //  showAlert(
        //   "Whoops...",
        //   "<p className='txtAlert'>Metamask is not installed, please install it on your browser to connect.</p><a target='_blank' href='https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en'>https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en</a>"
        // );
      }
      if (isConnected === true) {
        const web3 = window.web3;
        let contract = new web3.eth.Contract(abi, contractAddress);
        let accounts = await getAccounts();
        setAccount(accounts[0]);
        
        setState({
          mainAccount: accounts[0],
        });

        let accountDetails = null;
        window.ethereum.on("accountsChanged", function (accounts) {
          clearInterval(rev);
          setAccount(accounts[0]);
          getUpdateAccount(accounts);
          console.log(accounts);
          localStorage.setItem("load", accounts[0]);
        });
        accountDetails = await contract.methods.userData(accounts[0]).call();
        setMainAccountDetails(accountDetails);

        setMainAccountStake(
          parseFloat(
            web3.utils.fromWei(accountDetails.stakes, "ether")
          ).toFixed(3)
        );

        accountDetails?.deposit_time &&
          setRewardReady(
            moment(
              moment(
                new Date(accountDetails?.deposit_time * 1000).toISOString()
              ).add(7, "days")
            ).diff(moment(new Date().toISOString())) === 0
              ? true
              : false
          );
        await getRewardOnInterval(contract, accounts[0]);
        return parseFloat(accountDetails.stakes).toFixed(3);
      }
    } catch (error) {
      console.log(error);
      let obj = {
        show: true,
        severity: "error",
        message: "Error while connecting metamask",
        title: "Connecting Metamask",
      };
      setMessage(obj);
    }
  };

  // useEffect(() => {
  //   if (
  //     localStorage.getItem("load") !== null &&
  //     localStorage.getItem("load") !== undefined
  //   ) {
  //     window.location.reload();

  //     loadWeb3();
  //   }
  // }, [localStorage.getItem("load")]);
  // useEffect(() => {
  //   if (
  //     localStorage.getItem("load") !== null &&
  //     localStorage.getItem("load") !== undefined
  //   ) {
  //     loadWeb3();
  //     localStorage.removeItem("load");
  //   }
  //   console.log(" localStorage.getItem() ", localStorage.getItem("load"));
  // }, []);
  const getUpdateAccount = async (accounts) => {
    const web3 = window.web3;
    let contract = new web3.eth.Contract(abi, contractAddress);
    let accountDetails = await contract.methods.userData(accounts[0]).call();
    setMainAccountDetails(accountDetails);

    setMainAccountStake(
      parseFloat(web3.utils.fromWei(accountDetails.stakes, "ether")).toFixed(3)
    );

    accountDetails?.deposit_time &&
      setRewardReady(
        moment(
          moment(
            new Date(accountDetails?.deposit_time * 1000).toISOString()
          ).add(7, "days")
        ).diff(moment(new Date().toISOString())) === 0
          ? true
          : false
      );
    await getRewardOnInterval(contract, accounts[0]);
  };
  const getAccounts = async () => {
    const web3 = window.web3;
    try {
      let accounts = await web3.eth.getAccounts();
      console.log(accounts);
      return accounts;
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
      return null;
    }
  };
  // eslint-disable-next-line
  const isLockedAccount = async () => {
    try {
      let accounts = await getAccounts();
      if (accounts.length > 0) {
        console.log("Metamask is unlocked");
      } else {
        console.log("Metamask is locked");
      }
    } catch (error) {
      alert("Error while checking locked account");
    }
  };
  // eslint-disable-next-line
  const getBalanceOfAccount = async () => {
    const mainAccount = await getAccounts();
    const web3 = window.web3;
    web3.eth.getBalance(mainAccount[0], function (err, res) {
      console.log("Resp: ", res);
    });
  };
  // eslint-disable-next-line
  const getZinTokens = async (address) => {
    //   console.log("Account: ", address);
    //   const web3 = window.web3;
    //   let tokenContract = new web3.eth.Contract(tokenabi, tokenAddress);
    //   // let tokens = await tokenContract.methods.balanceOf(address).call();
    //   return tokens;
  };
  // eslint-disable-next-line
  const getStakeOf = async (contract, address) => {
    try {
      let stake = await contract.methods.stakeOf(address).call();
      return stake;
    } catch (error) {
      return null;
    }
  };
  const getUserData = async () => {
    const web3 = window.web3;
    console.log(abi, contractAddress);
    let contract = new web3.eth.Contract(abi, contractAddress);
    let accountDetails = null;

    accountDetails = await contract.methods.userData(account).call();
    let amount = accountDetails.stakes;
    console.log(parseFloat(accountDetails.stakes).toFixed(3));
    console.log(amount);
    setMainAccountStake(
      parseFloat(web3.utils.fromWei(accountDetails.stakes, "ether")).toFixed(3)
    );
    return parseFloat(accountDetails.stakes).toFixed(3);
  };

  const stakeZin = async (amount) => {
    console.log("");
    if (amount < 1) {
      let obj = {
        show: true,
        severity: "error",
        message: "A minimum of 1 eth is required to participate!",
        title: "Stake",
      };
      setMessage(obj);
      //
    } else {
      if (account === null) {
        //  showAlert("Whoops...", "Metamask is not connected.");
        let obj2 = {
          show: true,
          severity: "error",
          message: "Whoops..., Metamask is not connected.",
          title: "Stake",
        };
        setMessage(obj2);
      } else {
        let stakeAmount = await getUserData();
        handleCloseStake();
        if (!(stakeAmount < 1)) {
          let obj = {
            show: true,
            severity: "info",
            message: "You have already stake",
            title: "Stake",
          };
          setMessage(obj);
        } else {
          const web3 = window.web3;

          let _amount = amount.toString();
          let contract = new web3.eth.Contract(abi, contractAddress);
          console.log("web=======", web3.utils.toWei(_amount, "ether"));
          try {
            contract.methods
              .stakeEth()
              .send({
                from: account,
                value: web3.utils.toWei(_amount, "ether"),
              })
              .on("transactionHash", async (hash) => {
                let obj = {
                  show: true,
                  severity: "info",
                  message: "Your transaction is pending",
                  title: "Stake",
                };
                setMessage(obj);
                handleToggleBackdrop();
                setDropMessage("Your transaction is pending");
              })
              .on("receipt", async (receipt) => {
                let obj = {
                  show: true,
                  severity: "info",
                  message: "Your transaction is confirmed",
                  title: "Stake",
                };
                handleCloseBackdrop();
                setMessage(obj);
                stakeAmount = await getUserData();
              })
              .on("error", async (error) => {
                console.log("error", error);
                let obj = {
                  show: true,
                  severity: "error",
                  message: "User denied transaction",
                  title: "",
                };
                setMessage(obj);
                handleCloseBackdrop();
                setDropMessage("Your transaction is pending");
              });
          } catch (e) {
            console.log("error rejection", e);
            let obj = {
              show: true,
              severity: "error",
              message: "User has declined transaction",
              title: "Stake",
            };
            setMessage(obj);
          }
        }
      }
    }
  };

  const unStakeZin = async () => {
    // let _amount = amount.toString();
    // you have nothing staked
    if (account === null) {
      let obj2 = {
        show: true,
        severity: "error",
        message: "Whoops..., Metamask is not connected.",
        title: "Stake",
      };
      setMessage(obj2);
    } else {
      let stakeAmount = await getUserData();
      if (stakeAmount > 0 && rewardReady) {
        const web3 = window.web3;

        let contract = new web3.eth.Contract(abi, contractAddress);
        contract.methods
          .unstake()
          .send({ from: account })
          .on("transactionHash", async (hash) => {
            let obj = {
              show: true,
              severity: "info",
              message: "Your transaction is pending",
              title: "Stake",
            };
            setMessage(obj);
            handleToggleBackdrop();
            setDropMessage("Your transaction is pending");
          })
          .on("receipt", async (receipt) => {
            console.log("recept", receipt);
            handleCloseBackdrop();
            setDropMessage("");
            stakeAmount = await getUserData();
          })
          .on("error", async (error) => {
            console.log("error", error);
            let obj = {
              show: true,
              severity: "error",
              message: "User denied transaction",
              title: "",
            };
            setMessage(obj);
            handleCloseBackdrop();
            setDropMessage("");
          });
      } else {
        console.log(stakeAmount);
        let obj = {
          show: true,
          severity: "info",
          message:
            stakeAmount.toString() === "0.000"
              ? "You have nothing stake"
              : "Please wait for the timer to run out before unstaking",
        };
        setMessage(obj);
      }
    }
  };

  const withdraw = async () => {
    //you don't have any reward

    if (account === null) {
      let obj2 = {
        show: true,
        severity: "error",
        message: "Whoops..., Metamask is not connected.",
        title: "Stake",
      };
      setMessage(obj2);
    } else {
      setShowTimer(true);

      if (rewards > 0) {
        try {
          const web3 = window.web3;
          let contract = new web3.eth.Contract(abi, contractAddress);
          // eslint-disable-next-line
          let rewards = await contract.methods
            .withdrawReward()
            .send({
              from: account,
            })
            .on("transactionHash", async (hash) => {
              let obj = {
                show: true,
                severity: "info",
                message: "Your transaction is pending",
                title: "Stake",
              };
              setMessage(obj);
              handleToggleBackdrop();
              setDropMessage("Your transaction is pending");
            })
            .on("receipt", async (receipt) => {
              console.log("recept", receipt);
              handleCloseBackdrop();
              setDropMessage("");
              // eslint-disable-next-line
              let stakeAmount = await getUserData();
            })
            .on("error", async (error) => {
              console.log("error", error);
              let obj = {
                show: true,
                severity: "error",
                message: "User denied transaction",
                title: "",
              };
              setMessage(obj);
              handleCloseBackdrop();
              setDropMessage("");
            });
        } catch (error) {
          let obj2 = {
            show: true,
            severity: "error",
            message: "Error in Withdraw",
            title: "Stake",
          };
          setMessage(obj2);
          console.log("Error in Withdraw: ", error);
        }
      } else {
        let obj2 = {
          show: true,
          severity: "error",
          message: "You don't have any reward",
          title: "",
        };
        setMessage(obj2);
      }
    }
  };

  const getRewardOnInterval = async (contract, address) => {
    if (address !== null || address !== undefined) {
      try {
        const web3 = window.web3;
        let reward = await contract.methods.rewardOfEachUser(address).call();
        console.log("reward", reward);
        // Earned zYF
        setRewards(
          parseFloat(web3.utils.fromWei(reward?.payout, "ether")).toFixed(3)
        );
        console.log("interval clearend", rev);
        if (rev) {
          clearInterval(rev);
        }
        async function newF() {
          let reward = await contract.methods.rewardOfEachUser(address).call();
          setRewards(
            parseFloat(web3.utils.fromWei(reward?.payout, "ether")).toFixed(3)
          );
          console.log(
            parseFloat(web3.utils.fromWei(reward?.payout, "ether")).toFixed(3)
          );
          // setTimeout(() => {
          //   newF();
          //   console.log("check");
          // }, 4000);
        }
        // setTimeout(() => {
        //   newF();
        // }, 4000);

        rev = setInterval(newF, 5000);
        // console.log("interval clearend", revs);

        // setRev(revs);
      } catch (error) {
        let obj = {
          show: true,
          severity: "error",
          message: "Error while fetching rewards",
          title: "Fetching Rewards",
        };
        setMessage(obj);
        console.log("Error while fetching rewards: ", error);
      }
    }
  };
  // eslint-disable-next-line
  // const getTotalStake = async (contract) => {
  //   let totalStakes = await contract.methods.totalStakes().call();
  //   console.log("total stakes", totalStakes);
  //   return totalStakes;
  // };
  // eslint-disable-next-line
  useEffect(async () => {
    let newVal = await getTVLValue();
    setTotalStakeAmount(newVal);
    console.log("log===", newVal);
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <Dialog
        open={openStakeDialog}
        confirm={stakeZin}
        handleClose={handleCloseStake}
        enteredAmount={enteredAmount}
        setEnteredAmount={setEnteredAmount}
      />
      <Backdrop
        className={classes.backdrop}
        open={openBackdrop}
        // onClick={handleCloseBackdrop}
      >
        <CircularProgress color="inherit" />
        {dropMessage}
      </Backdrop>
      <div
        className={classes.root}
        style={{ position: "absolute", top: "50%", bottom: "50%" }}
      >
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={message?.show}
          onClose={handleClose}
          autoHideDuration={9000}
        >
          <AlertComponent onClose={handleClose} severity={message?.severity}>
            {message?.message}
          </AlertComponent>
        </Snackbar>
      </div>

      <Header loadWeb3={loadWeb3} account={account} redirectToIntro={props?.redirectToIntro} />
      <Grid container style={{ display: "flex", justifyContent: "center" }}>
        <Grid item xs={12} xm={12} md={8} lg={6} xl={6}>
          <Grid container>
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <Card
                usdRate={usdRate}
                accountDetails={mainAccountDetails}
                showTimer={showTimer}
                totalStakesAmount={totalStakesAmount}
                account={account}
              />
            </Grid>
          </Grid>
          <Grid
            container
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Grid
              item
              xs={12}
              xm={12}
              md={8}
              lg={6}
              xl={6}
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <StackingCard
                mainAccountStake={mainAccountStake}
                accountDetails={mainAccountDetails}
                stake={handleOpenStake}
                unStake={unStakeZin}
              />
            </Grid>
            <Grid
              item
              xs={12}
              xm={12}
              md={8}
              lg={6}
              xl={6}
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <DepositeCard
                withdraw={withdraw}
                showTimer={showTimer}
                rewards={rewards}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
