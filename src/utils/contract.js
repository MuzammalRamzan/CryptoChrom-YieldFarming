import Web3 from "web3";

const initializeWeb3 = async () => {
  try {
    const provider = window?.ethereum || window?.web3?.currentProvider;
    if (provider) {
      window.web3 = new Web3(provider);
      window.web3.eth.handleRevert = true;
    } else {
      alert(
        "You don't have web3, consider downloading metamask for Chrome or Trust Wallet for Mobile"
      );
      return false;
    }
  } catch (error) {
    console.log("error initalizeWeb3", error);
  }
};

const connectWallet = async () => {
  if (window.web3) {
    return (await window.ethereum.enable())[0];
  } else {
    return false;
  }
};
export { connectWallet, initializeWeb3 };
