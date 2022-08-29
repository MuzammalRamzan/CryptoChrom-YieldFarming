import React from "react";
import "../Token/token.css"
export default function Token() {
  return (
    <div>
      <center>
        <div id="token-ticket">
          <h2 className="farmable-token">Farmable tokens</h2>
          <form method="POST">
            <input
              type="text"
              name="find"
              placeholder="Search Tokens"
              className="form-control"
              id="form-control-id"
              style={{ background: "none", color: "#fff" }}
            />
          </form>
        </div>
      </center>
    </div>
  );
}
