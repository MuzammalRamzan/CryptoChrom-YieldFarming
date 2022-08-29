const Web3 = require("web3");
const Tx = require("ethereumjs-tx").Transaction;
const express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const app = express();
app.use(bodyParser.json());
const fetch = require("node-fetch");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
let web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/32e8833d78054890b364106c5b759454"
  )
);
const contractAddress = "0x388f7E6d45e058AA703227B44e216e3bE3C6A6E7"; // Deployed manually
const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "_address", type: "address" },
      { internalType: "bool", name: "_allow", type: "bool" },
    ],
    name: "adminAllowFarmGenerator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_index", type: "uint256" }],
    name: "farmAtIndex",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_index", type: "uint256" }],
    name: "farmGeneratorAtIndex",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "farmGeneratorsLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "farmsLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_farmAddress", type: "address" },
    ],
    name: "registerFarm",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "userEnteredFarm",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_user", type: "address" },
      { internalType: "uint256", name: "_index", type: "uint256" },
    ],
    name: "userFarmAtIndex",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "userFarmsLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "userLeftFarm",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
async function farmAtIndex(index) {
  const contract = new web3.eth.Contract(abi, contractAddress, {
    gasLimit: 3000000,
  });
  try {
    const address = await contract.methods.farmAtIndex(index).call();
    return address;
  } catch (error) {
    return error;
  }
}

async function farmsLength() {
  const contract = new web3.eth.Contract(abi, contractAddress, {
    gasLimit: 3000000,
  });
  try {
    const address = await contract.methods.farmsLength().call();
    return address;
  } catch (error) {
    return error;
  }
}
app.post("/getFarmLength", async function (req, res) {
  try {
    let length = await farmsLength();

    res.send({ success: true, result: length });
  } catch (error) {
    console.log(error);
    res.send({ success: false, error: "Transaction error!" });
  }
});
app.post("/getFarmInfo", async function (req, res) {
  let page = req.query.page;
  console.log("page", page);
  try {
    let arr = [];
    let length = await farmsLength();

    let newLength = Math.min(page * 7, length);
    let m = page * 7 - 7;
    console.log("newLength", newLength, m);
    console.log(m);
    for (let index = m; index < newLength; index++) {
      let address = await farmAtIndex(index);
      console.log("index", index, address);
      let response = await fetch(
        "https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=" +
          address +
          "&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
      );
      let data = await response.json();
      let abi = JSON.parse(data.result);
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
      };
      arr.push(farmInfo);
    }
    console.log(arr);
    res.send({ success: true, result: arr });
  } catch (error) {
    console.log(error);
    res.send({ success: false, error: "Transaction error!" });
  }
});
app.listen(4000, function () {
  console.log("Server started at 4000...");
});
