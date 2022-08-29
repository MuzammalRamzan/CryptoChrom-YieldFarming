import React, { useEffect, useState } from "react";
import axios from "axios";

import { useSelector } from "react-redux";
import headerLogo from "./images/headerLogo.png";
import Widthdraw from "../Dialog/widthdraw";
import Deposit from "../Dialog/Deposit";
import { useDispatch } from "react-redux";
import "./FormCardFooter.css";

const FormCardFooter = (props) => {
  const accountAddress = useSelector((state) => state?.mainAccount);
  //data
  const { accountData, value } = props;
  const [blnce, setBlnce] = useState(0);
  const dispatch = useDispatch();
  const [address, setAddress] = useState(null);
  const [abi, setAbi] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const [usdRate, setUsdRate] = useState(0);

  const homeReducer = useSelector((state) => state?.farmsArray);

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
    setAccount(accountAddress);
    console.log("accountAddress", accountAddress);
    getData();
  }, [accountAddress, value]);
  const getData = async () => {
    try {
      console.log("accountData", accountData);

      if (accountData?.address) {
        console.log("component did update");

        let response = await fetch(
          "https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=" +
            accountData?.address +
            "&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
        );
        let data = await response.json();
        console.log("data", data);
        let abi = JSON.parse(data.result);

        const web3 = window.web3;
        let contracts = new web3.eth.Contract(abi, accountData?.address, {
          gasLimit: 3000000,
        });

        setAddress(address);
        setAbi(abi);
        setContract(contracts);
        console.log("data", account, accountAddress);

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
        console.log("balance ", blnce3);

        setBlnce(parseFloat(web3.utils.fromWei(blnce3, "ether")).toFixed(3));
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

  return (
    <div className="cardFormFooter">
      <div className="fa_logos">
        <i className="fa fa-tree" aria-hidden="true">
          {/* {blnce * usdRate !== 0 ? (blnce * usdRate).toFixed(3) : 0} */}
        </i>
        <i className="fa fa-tree" aria-hidden="true">
          100k
        </i>
        <i className="fa fa-tree" aria-hidden="true">
          100k
        </i>
        <i className="fa fa-tree" aria-hidden="true">
          100k
        </i>
      </div>
    </div>
  );
};

export default FormCardFooter;
