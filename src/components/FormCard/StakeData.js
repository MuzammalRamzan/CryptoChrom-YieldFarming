import React, { useEffect, useState } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
import headerLogo from "./images/headerLogo.png";
import "./StakeData.css";
import Widthdraw from "../Dialog/widthdraw";
import Deposit from "../Dialog/Deposit";
import { useDispatch } from "react-redux";
const StakeData = (props) => {
  const accountAddress = useSelector((state) => state?.mainAccount);

  const { accountData } = props;
  const [blnce, setBlnce] = useState(0);
  const dispatch = useDispatch();
  const [address, setAddress] = useState(null);
  const [abi, setAbi] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [openWidthdrawModal, setOpenWidthdrawModal] = useState(false);
  const [openStakeModal, setOpenStakeModal] = useState(false);
  const [usdRate, setUsdRate] = useState(0);
  const [userInfoAmount, setUserInfoAmount] = useState(0);
  const [userInfoReward, setUserInfoReward] = useState(0);
  const homeReducer = useSelector((state) => state?.farmsArray);

  useEffect(async () => {
    await axios
      .get(
        "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,IOT&tsyms=USD"
      )
      .then((res) => {
        const cryptos = res.data;
        setUsdRate(cryptos["ETH"].USD);
      });
  }, []);
  useEffect(() => {
    setAccount(accountAddress);
    getData();
  }, [accountAddress]);
  const getData = async () => {
    try {
      if (accountData?.address) {
        let response = await fetch(
          "https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=" +
            accountData?.address +
            "&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
        );
        let data = await response.json();
        let abi = JSON.parse(data.result);
        const web3 = window.web3;

        let contracts = new web3.eth.Contract(abi, accountData?.address, {
          gasLimit: 3000000,
        });

        setAddress(address);
        setAbi(abi);
        setContract(contracts);
        //approve accountData?.address
        let userInfoData = await contracts.methods
          .userInfo(accountAddress)
          .call();
        setUserInfoAmount(
          parseFloat(web3.utils.fromWei(userInfoData.amount, "ether")).toFixed(
            6
          )
        );

        let response2 = await fetch(
          "https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=" +
            accountData?.lpToken +
            "&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
        );

        let data3 = await response2.json();
        let abi3 = JSON.parse(data3.result);
        let contract3 = new web3.eth.Contract(abi3, accountData?.lpToken, {
          gasLimit: 3000000,
        });
        let blnce3 = await contract3.methods.balanceOf(accountAddress).call();
        let pendingReward = await contracts.methods
          .pendingReward(accountAddress)
          .call();
        console.log("pending reward============", pendingReward);
        setUserInfoReward(
          parseFloat(web3.utils.fromWei(pendingReward, "ether")).toFixed(6)
        );
        setBlnce(parseFloat(web3.utils.fromWei(blnce3, "ether")).toFixed(6));
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getData();
  }, [homeReducer]);
  useEffect(async () => {
    getData();
  }, []);
  const openWidthdraw = () => {
    setOpenWidthdrawModal(true);
  };
  const openStake = () => {
    setOpenStakeModal(true);
  };
  const withdraw = async (amount) => {
    //you don't have any reward

    if (account === null || account === undefined || account === "") {
      dispatch({
        type: "SHOW_MESSAGE",
        payload: {
          body: "Whoops..., Metamask is not connected.",
          title: "",
          show: true,
        },
      });
    } else {
      // setShowTimer(true);
      try {
        const web3 = window.web3;
        const block = await web3.eth.getBlock("latest");
        let gasLimit = block.gasLimit / block.transactions.length;
        console.log("gas", gasLimit);
        // eslint-disable-next-line
        let rewards = await contract.methods
          .withdraw(web3.utils.toWei(amount.toString(), "ether"))
          .send({
            from: account,
            gasLimit: 210000,
          })
          .on("transactionHash", async (hash) => {
            dispatch({
              type: "SHOW_MESSAGE",
              payload: {
                body: "Your transaction is pending",
                title: "",
                show: true,
              },
            });
          })
          .on("receipt", async (receipt) => {
            getData();
            dispatch({ type: "HIDE_MESSAGE", payload: "" });
          })
          .on("error", async (error) => {
            dispatch({
              type: "SHOW_MESSAGE",
              payload: {
                body: "User denied transaction",
                title: "",
                show: true,
              },
            });
          });
      } catch (error) {
        dispatch({
          type: "SHOW_MESSAGE",
          payload: {
            body: "Error in Withdraw",
            title: "",
            show: true,
          },
        });
      }
    }
  };

  const stakeAmounts = async (amount) => {
    // if (blnce < 1) {
    // let obj = {
    //   show: true,
    //   severity: "error",
    //   message: "A minimum of 1 eth is required to participate!",
    //   title: "Stake",
    // };
    // setMessage(obj);
    //
    // } else {
    if (account === null || account === undefined || account === "") {
      dispatch({
        type: "SHOW_MESSAGE",
        payload: {
          body: "Whoops..., Metamask is not connected.",
          title: "",
          show: true,
        },
      });
    } else {
      // let stakeAmount = await getUserData();
      // handleCloseStake();
      // if (!(blnce < 1)) {
      // let obj = {
      //   show: true,
      //   severity: "info",
      //   message: "You have already stake",
      //   title: "Stake",
      // };
      // setMessage(obj);
      // } else {
      const web3 = window.web3;

      try {
        contract.methods
          .deposit(web3.utils.toWei(amount.toString(), "ether"))
          .send({
            from: account,
            gasLimit: 210000,
            // value: web3.utils.toWei(amount.toString(), "ether"),
          })
          .on("transactionHash", async (hash) => {
            dispatch({
              type: "SHOW_MESSAGE",
              payload: {
                body: "Your transaction is pending",
                title: "",
                show: true,
              },
            });
          })
          .on("receipt", async (receipt) => {
            dispatch({ type: "HIDE_MESSAGE", payload: "" });
            getData();
          })
          .on("error", async (error) => {
            dispatch({
              type: "SHOW_MESSAGE",
              payload: {
                body: "User denied transaction",
                title: "",
                show: true,
              },
            });
          });
      } catch (e) {
        // let obj = {
        //   show: true,
        //   severity: "error",
        //   message: "User has declined transaction",
        //   title: "Stake",
        // };
        // setMessage(obj);
      }
      // }
    }
    // }
  };

  const emergencyWithdraws = async (amount) => {
    // if (amount < 1) {
    // let obj = {
    //   show: true,
    //   severity: "error",
    //   message: "A minimum of 1 eth is required to participate!",
    //   title: "Stake",
    // };
    // setMessage(obj);
    //
    // } else {
    if (account === null || account === undefined || account === "") {
      dispatch({
        type: "SHOW_MESSAGE",
        payload: {
          body: "Whoops..., Metamask is not connected.",
          title: "",
          show: true,
        },
      });
    } else {
      // let stakeAmount = await getUserData();
      // handleCloseStake();
      // if (!(stakeAmount < 1)) {
      // let obj = {
      //   show: true,
      //   severity: "info",
      //   message: "You have already stake",
      //   title: "Stake",
      // };
      // setMessage(obj);
      // } else {
      const web3 = window.web3;

      try {
        contract.methods
          .emergencyWithdraw()
          .send({
            from: account,
            gasLimit: 210000,
          })
          .on("transactionHash", async (hash) => {
            dispatch({
              type: "SHOW_MESSAGE",
              payload: {
                body: "Your transaction is pending",
                title: "",
                show: true,
              },
            });
          })
          .on("receipt", async (receipt) => {
            dispatch({ type: "HIDE_MESSAGE", payload: "" });
            getData();
          })
          .on("error", async (error) => {
            dispatch({
              type: "SHOW_MESSAGE",
              payload: {
                body: "User denied transaction",
                title: "",
                show: true,
              },
            });
          });
      } catch (e) {
        dispatch({
          type: "SHOW_MESSAGE",
          payload: {
            body: "User denied transaction",
            title: "",
            show: true,
          },
        });
      }
      // }
    }
    // }
  };

  return (
    <div>
      {/* modal */}
      {openWidthdrawModal && (
        <Widthdraw
          open={openWidthdrawModal}
          setOpen={setOpenWidthdrawModal}
          withdraw={withdraw}
        />
      )}
      {openStakeModal && (
        <Deposit
          accountData={accountData}
          open={openStakeModal}
          setOpen={setOpenStakeModal}
          withdraw={stakeAmounts}
        />
      )}
      {/* modal end */}
      <div className="stakeHeader">
        <div>
          <img src={headerLogo} height="35" />
          <h2>{accountData?.cardName}</h2>
        </div>
        <div>
          <img src={headerLogo} height="35" />
          <h2>WETH</h2>
        </div>
      </div>

      {/* userinfo.amount check with || */}
      {/* userInfoAmount */}
      {/* {blnce < 0 ? ( */}
      {blnce == 0 && userInfoAmount == 0 ? (
        <>
          <div className="stakeDes">
            <p>You need UniV2 liquidity tokens to farm this pool</p>
          </div>
          <a
            href={`https://info.uniswap.org/pair/${props?.linkToken}`}
            target="_blank"
            style={{ color: "#00008B" }}
          >
            <div className="stakeFooter">
              <i className="fa fa-paw" aria-hidden="true"></i>
              <p>Get liquidity tokens</p>
            </div>
          </a>
        </>
      ) : (
        <>
          <hr />

          <div
            className={parseFloat(blnce) === 0 ? "my-first-div" : "third-div"}
          >
            <div
              className={parseFloat(blnce) === 0 ? "univ2-div" : "third-1-div"}
            >
              {blnce === 0 ? (
                <p>Avaiable to stake</p>
              ) : (
                <h5>Avaiable to stake</h5>
              )}
              {parseFloat(blnce) === 0 ? (
                <p>{parseFloat(blnce) === 0 ? 0 : blnce} UNIv2</p>
              ) : (
                <h4>{parseFloat(blnce) === 0 ? 0 : blnce} UNIv2</h4>
              )}
              {/* <p>
                $ {blnce * usdRate !== 0 ? (blnce * usdRate).toFixed(3) : 0}
              </p> */}
              {/* blnce convert to $ */}
            </div>
            <div>
              <button
                disabled={parseFloat(blnce) === 0}
                className={
                  parseFloat(blnce) === 0 ? "stake-btn" : "withdraw-btn"
                }
                onClick={openStake}
              >
                stake
              </button>
            </div>
          </div>

          <div className="second-div">
            <div className="icon-div">
              <div id="add-more-div">
                <a
                  href={`https://info.uniswap.org/pair/${props?.linkToken}`}
                  target="_blank"
                  style={{ color: "#00008B" }}
                >
                  Add more liquidity
                  <i class="fa fa-clone" aria-hidden="true"></i>
                </a>
              </div>
              <div className="your-pool-div">
                <p>Your pool share: 0.01% </p>
              </div>
            </div>
            <div className="third-div">
              <div className="third-1-div">
                <h5>Staking</h5>
                <h4>
                  {parseFloat(userInfoAmount) === 0 ? 0 : userInfoAmount} UNIv2
                </h4>
                {/* userinfo.reward convert to $ */}

                {/* <p>
                  ${" "}
                  {usdRate * userInfoAmount !== 0
                    ? (usdRate * userInfoAmount).toFixed(3)
                    : 0}
                </p> */}
              </div>
              <div>
                <button className="withdraw-btn" onClick={openWidthdraw}>
                  Withdraw
                </button>
              </div>
            </div>

            <div className="forth-div">
              <div className="unclaim-p">
                <p>Unclaimed rewards</p>
              </div>
              <div className="unclaimed-div">
                <div className="uncl-logo">
                  <div className="uncl-div">
                    <img src={headerLogo} height="35" />
                    <h2>UNCL</h2>
                  </div>
                  <p>Wallet balance:</p>
                </div>
                <div className="digit">
                  <h2>{userInfoReward}</h2>
                  {/* userinfo.amount convert to $ */}

                  <p>
                    {/* ${" "}
                    {usdRate * userInfoReward !== 0
                      ? (usdRate * userInfoReward).toFixed(3)
                      : 0} */}
                  </p>
                </div>
              </div>

              <button onClick={emergencyWithdraws}>Harvest</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StakeData;
