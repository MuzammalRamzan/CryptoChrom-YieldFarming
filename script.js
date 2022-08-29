$("#metamask").click(async()=>{
    const provider = window.web3.currentProvider || window.ethereum
    const web3 = new Web3(provider)
    console.log(await provider.enable())
})