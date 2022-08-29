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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
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
            <Grid item>{"Withdraw UNIV2 tokens"}</Grid>
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
          <Button
            onClick={handleAccept}
            color="primary"
            style={{ width: "100%" }}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
