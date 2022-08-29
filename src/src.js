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

