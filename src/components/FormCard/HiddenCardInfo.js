import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./HiddenCardInfo.css";

const HiddenCardInfo = (props) => {
  const {
    accountAddress,
    accountData,
    blockReward,
    startBlock,
    bonusEndBlock,
    bonus,
    endBlock,
    bonnumFarmersus,
  } = props;
  const accountAddress1 = useSelector((state) => state?.mainAccount);
  const [bonusEndBlock1, setbonusEndBlock] = useState(null);
  const [bonus1, setbonus] = useState(null);
  const [endBlock1, setendBlock] = useState(null);
  const [bonnumFarmersus1, setbonnumFarmersus] = useState(null);
  const [blockReward1, setblockReward1] = useState(null);
  const [userInfoReward, setUserInfoReward] = useState(0);
  const [blance, setBlnce] = useState(0);
  const [userInfoAmount, setUserInfoAmount] = useState(0);
  const [usdRate, setUsdRate] = useState(0);
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
  useEffect(() => {
    getData();
  }, [accountAddress1]);
  const getData = async () => {
    try {
      if (accountData?.address) {
        console.log("component did update");

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

        let userInfoData = await contracts.methods
          .userInfo(accountAddress1)
          .call();
        setUserInfoAmount(
          parseFloat(web3.utils.fromWei(userInfoData.amount, "ether")).toFixed(
            3
          )
        );
        setUserInfoReward(
          parseFloat(
            web3.utils.fromWei(userInfoData.rewardDebt, "ether")
          ).toFixed(3)
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
        let blnce3 = await contract3.methods.balanceOf(accountAddress1).call();
        console.log("balance ", blnce3);

        setBlnce(parseFloat(web3.utils.fromWei(blnce3, "ether")).toFixed(3));
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getData();
    setblockReward1(blockReward);
    setbonusEndBlock(bonusEndBlock);
    setbonus(bonus);
    setendBlock(endBlock);
    setbonnumFarmersus(bonnumFarmersus);
    handleFechData();
  }, []);

  const handleFechData = async () => {
    try {
      let address = await this.farmAtIndex(accountData?.indexAt);
      let response = await fetch(
        "https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=" +
          address +
          "&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
      );
      let response2 = await fetch(
        "https://api-kovan.etherscan.io/api?module=account&action=tokentx&address=" +
          address +
          "&startblock=0&endblock=999999999&sort=asc&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
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
      setblockReward1(web3.utils.fromWei(detail.blockReward, "ether"));
      setbonusEndBlock(detail.bonusEndBlock);
      setbonus(detail.bonus);
      setendBlock(detail.endBlock);
      setbonnumFarmersus(detail.numFarmers);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="hiddenCardInfo">
      <div className="percentageDiv">
        <div className="arrowLogo">
          <i className="fa fa-arrow-up" aria-hidden="true"></i>
        </div>
        <div className="arrowLogoDetail">
          <p>APY (in dollar value)</p>
          <h2>39%</h2>
          <p>
            This fluctuates based on the reward token price and the value of
            total lp tokens farming
          </p>
        </div>
      </div>
      <hr />
      <div className="dollarDiv">
        <div className="tintLogo">
          <i className="fa fa-tint" aria-hidden="true"></i>
        </div>
        <div className="tintLogoDetail">
          <p>Total Ip tokens farming</p>
          <h2>
            $
            {usdRate * userInfoAmount !== 0
              ? (usdRate * userInfoAmount).toFixed(3)
              : 0}
          </h2>
          <p> {parseFloat(userInfoAmount) === 0 ? 0 : userInfoAmount} UNIV2</p>
        </div>
      </div>
      <hr />
      <div className="startBlockDiv">
        <div className="tintLogo">
          <i className="fa fa-cube" aria-hidden="true"></i>
        </div>
        <div className="cubeLogoDetail">
          <p>Block reward</p>
          <div>
            <h2>
              <span id="hiden-no">{blockReward1}</span>
            </h2>
            <h4 className="uncl"> UNCL</h4>
          </div>
        </div>
      </div>
      <hr />
      <div className="startBlockDiv">
        <div className="toggleOffLogo">
          <i className="fa fa-toggle-off" aria-hidden="true"></i>
        </div>
        <div className="toggleOffLogoDetail">
          <p>Start Block</p>
          <h2>{startBlock}</h2>
        </div>
      </div>
      <hr />
      <div className="bonusMultiplierDiv">
        <div className="toggleOnLogo">
          <i className="fa fa-toggle-on" aria-hidden="true"></i>
        </div>
        <div className="toggleOnLogoDetail">
          <p className="sameP2">Bonus Multiplier / Bonus end block</p>
          <p className="sameP">{bonus1}x Bonus</p>
          {/* <p className="sameP">Sat 21 Nov 14:52 / a month ago</p> */}
          <p className="sameP2">Block:{bonusEndBlock1} </p>
        </div>
      </div>
      <hr />
      <div className="endBlockDiv">
        <div className="toggleOff2Logo">
          <i className="fa fa-toggle-off" aria-hidden="true"></i>
        </div>
        <div className="toggleOff2LogoDetail">
          <p>End block (in 4 months)</p>
          <h2>{endBlock}</h2>
        </div>
      </div>
      <hr />
      <div className="amountVaultDiv">
        <div className="shieldLogo">
          <i className="fa fa-shield" aria-hidden="true"></i>
        </div>
        <div className="shieldLogoDetail">
          <p>Amount in vault</p>
          <h2>{`${parseFloat(blance) === 0 ? 0 : blance} UNCL`} </h2>
        </div>
      </div>
      <hr />
      <div className="numberFarmerDiv">
        <div className="userLogo">
          <i className="fa fa-user-circle-o" aria-hidden="true"></i>
        </div>
        <div className="userLogoDetail">
          <p>Number of farmers</p>
          <h2>{bonnumFarmersus1}</h2>
        </div>
      </div>
      <hr />
      <div className="pendingRewardDiv">
        <div className="arrowDownLogo">
          <i className="fa fa-arrow-circle-down" aria-hidden="true"></i>
        </div>
        <div className="arrowDownLogoDetail">
          <p>Your pending reward</p>
          <h2>
            {`${parseFloat(userInfoReward) === 0 ? 0 : userInfoReward} UNCL`}{" "}
          </h2>
        </div>
      </div>
    </div>
  );
};
export default HiddenCardInfo;
