import React from "react";
import FormCardHeader from "./FormCardHeader";
import FormCardDes from "./FormCardDes";
import FormCardFooter from "./FormCardFooter";
import FooterTabsView from "./FooterTabsView";
import "./FormCard.css";

const FormCard = ({ data, accountAddress }) => {
  const { lpToken } = data;
  const [value, setValue] = React.useState(false);
  const clickHandler = () => {
    setValue(!value);
    console.log(!value);
  };
  return (
    <center>
      <div className="formContainer">
        <div onClick={clickHandler}>
          <FormCardHeader data={data} />
          <FormCardDes />
          <FormCardFooter
            value={value}
            accountData={data}
            accountAddress={accountAddress}
          />
        </div>

        {value && (
          <FooterTabsView data={data} accountAddress={accountAddress} />
        )}
      </div>
    </center>
  );
};

export default FormCard;
