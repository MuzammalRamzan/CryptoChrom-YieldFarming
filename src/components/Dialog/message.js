import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import { Grid, CircularProgress } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
  const stateMessage = useSelector((state) => state?.message);
  const dispatch = useDispatch();
  const [amount, setAmount] = React.useState(0);
  const [errors, setErrors] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    dispatch({ type: "HIDE_MESSAGE", payload: "" });
    setOpen(false);
  };
  const handleAccept = () => {
    setErrors(true);

    // setOpen(false);
  };
  const handleChnageAmount = (value) => {
    setErrors(false);
    setAmount(value);
  };

  useEffect(() => {
    if (stateMessage?.show) {
      setTimeout(() => {
        dispatch({ type: "HIDE_MESSAGE", payload: "" });
      }, 5000);
    }
  }, [stateMessage?.show]);
  return (
    <div>
      <Dialog
        open={stateMessage?.show}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        style={{ minWidth: "150px" }}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          <Grid container justify={"space-between "}>
            <Grid item xs={10}>
              {stateMessage?.title}
            </Grid>
            <Grid
              item
              xs={2}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignSelf: "flex-end",
              }}
            >
              <CloseIcon onClick={handleClose} style={{ cursor: "pointer" }} />
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            style={{ color: "#4BC1E8" }}
          >
            {stateMessage?.body}
          </DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
}
