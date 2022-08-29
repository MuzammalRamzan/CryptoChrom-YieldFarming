import React from "react";
import { Link } from "react-router-dom";
import "../Index/Index.css";
import "../Account/account.css"
export default function Account() {
  return (
    <div >
      <center>
        
        <div className="account-box" id="ticket">
          <img src="img/icon/farm_token.png" alt="" />
          <p style={{ color: "#fff", fontWeight: "700" }}>
            Your not farming any tokens yet!
          </p>
          <Link to="/">
            <button
            id="btn-primary"
              className="btn btn-primary btn-lg"
              style={{
                background: "none",
                color: "#fff",
                border: "2px solid #fff",
                fontWeight: "700",
              }}
            >
              View Farm
            </button>
          </Link>
        </div>
      </center>
    </div>
  );
}
