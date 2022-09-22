const init_state = {
  tab: "",
  startingChat: "",
  opponents: [],
  address: "",
  signer: "",
  storage: "",
  updater: {},
};

const reducer = (state = init_state, action) => {
  switch (action.type) {
    case "GET_POSITION":
      return { ...state, tab: action.data };
    case "GET_STARTING_CHAT":
      return { ...state, startingChat: action.data };
    case "STORE_MESSAGE":
      return { ...state, opponents: action.data };
    case "STORE_ADDRESS":
      return { ...state, address: action.data };
    case "STORE_SIGNER":
      return { ...state, signer: action.data };
    case "STORE_STORAGE":
      return { ...state, storage: action.data };
    case "AUTO_UPDATER":
      return { ...state, updater: action.data };
    default:
      return state;
  }
};

export default reducer;
