let initialState = {
  farmsArray: [],
  cuurentAccount: null,
  message: {
    body: "",
    title: "",
    show: false,
  },
  contractInstance: null,
  mainAccount: "",
  isSetMainAccount: false,
  allowance: 0,
  powerDecimal: 1,
};
function homeReducer(state = initialState, action) {
  switch (action.type) {
    case "SET_POWERDECIMAL": {
      return {
        ...state,
        powerDecimal: action?.payload,
      };
    }
    case "SET_ALLOWANCE": {
      console.log("action?.payload", action?.payload);
      return {
        ...state,
        allowance: action?.payload,
      };
    }
    case "SET_CONTRACT": {
      return {
        ...state,
        contractInstance: action?.payload,
      };
    }
    case "SET_MAIN_ACCOUNT": {
      return {
        ...state,
        mainAccount: action?.payload?.account,
        isSetMainAccount: action?.payload?.isSet,
      };
    }
    case "LOG_OUT": {
      return {
        ...state,
        mainAccount: "",
        isSetMainAccount: false,
      };
    }
    case "STORE_DATA":
      state = { ...state, farmsArray: action.result };
      return state;
    case "SET_CURRENT_ACCOUNT":
      state = { ...state, cuurentAccount: action.account };
      return state;
    case "HIDE_MESSAGE":
      return {
        ...state,
        message: {
          body: "",
          title: "",
          show: false,
        },
      };
    case "SHOW_MESSAGE":
      return {
        ...state,
        message: action.payload,
      };

    default:
      return state;
  }
}
export default homeReducer;
