import React from "react";
import headerLogo from "./images/headerLogo.png";
import "./FormCardHeader.css";

const FormCardHeader = ({ data }) => {
  return (
    <div className="cardHeaderContainer">
      <div className="headerLogo">
        <img src={headerLogo} height="35" />
      </div>
      <div className="titleSubtitle">
        <h2>{`Farm ${data?.cardName} `}</h2>
        <p>{data?.cardName} / WETH</p>
      </div>
    </div>
  );
};

export default FormCardHeader;
