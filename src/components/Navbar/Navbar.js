import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useSelector, useDispatch } from "react-redux";
const Navbar = (props) => {
  const dispatch = useDispatch();
  const mainAccount = useSelector((state) => state?.mainAccount);
  const isSetMainAccount = useSelector((state) => state?.isSetMainAccount);

  const connectBtn = (
    <button
      className="btn btn-primary"
      data-toggle="modal"
      data-target="#myWallet"
      style={{ width: "150px", borderRadius: "50px" }}
    >
      Connect
    </button>
  );
  const address = (
    <button
      className="btn btn-primary text-center"
      style={{ width: "150px", borderRadius: "50px" }}
    >
      {`${mainAccount.slice(0, 7)}...${mainAccount.slice(37, -1)}`}
    </button>
  );
  const logout = () => {
    dispatch({
      type: "SET_MAIN_ACCOUNT",
      payload: { account: "", isSet: false },
    });
  };
  const top = isSetMainAccount ? address : connectBtn;
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" id="nav1">
      <img src="img/logo.svg" width="50" alt="" />
      <Link
        className="navbar-brand"
        to="/#"
        style={{
          color: "#fff",
          fontSize: "24px",
          fontWeight: "bold",
          marginLeft: "20px",
        }}
      >
        {" "}
        CryptoChrome
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <div className="row" id="connect-div">
          <div className="con-btn">{top}</div>
          <div className="con-btn" onClick={logout}>
            <button className="btn btn-warning">
              <span className="fa ">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
