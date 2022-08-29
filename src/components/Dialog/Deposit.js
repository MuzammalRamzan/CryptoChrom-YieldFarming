import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import { Grid, TextField } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const dispatch = useDispatch();
  const accountAddress = useSelector((state) => state?.mainAccount);

  const { open, setOpen, withdraw } = props;
  const [amount, setAmount] = React.useState(0);
  const [errors, setErrors] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleAccept = () => {
    if (amount > 0) {
      withdraw(amount);
      setOpen(false);
    } else {
      setErrors(true);
    }
  };
  const handleChnageAmount = (value) => {
    setErrors(false);
    setAmount(value);
  };
  const onApprove = async () => {
    const web3 = window.web3;

    let lpTokenAddress = props.accountData.lpToken;
    let addressToVerify = props.accountData.address;
    try {
      let response = await fetch(
        "https://api-kovan.etherscan.io/api?module=contract&action=getabi&address=" +
          lpTokenAddress +
          "&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
      );
      console.log("response", response);

      let data = await response.json();
      console.log("result ============================ 2", data);
      let abi = JSON.parse(data.result);
      const contract2 = new web3.eth.Contract(abi, lpTokenAddress, {
        gasLimit: 3000000,
      });
      contract2.methods
        .approve(addressToVerify, amount)
        .send({
          from: accountAddress,
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
          // getData();
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
  };
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <Grid container justify={"space-between "}>
            <Grid item>{"Deposit UNIV2 tokens"}</Grid>
            <Grid item style={{ marginLeft: "10px" }}>
              <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <TextField
              id="standard-basic"
              error={errors}
              helperText={errors && "Minimum Amount should be greater then 0"}
              label="Enter Amount"
              fullWidth
              type={"number"}
              value={amount}
              onChange={(e) => handleChnageAmount(e.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onApprove} style={{ width: "50%" }}>
            Approve
          </Button>
          <Button
            onClick={handleAccept}
            color="primary"
            style={{ width: "50%" }}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
