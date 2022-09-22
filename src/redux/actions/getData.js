export const getAddress = (address) => {
  return (dispatch) => {
    dispatch({
      type: "STORE_ADDRESS",
      data: address,
    });
  };
};

export const getSigner = (signer) => {
  return (dispatch) => {
    dispatch({
      type: "STORE_SIGNER",
      data: signer,
    });
  };
};

export const getTab = (position) => {
  return (dispatch) => {
    dispatch({
      type: "GET_POSITION",
      data: position,
    });
  };
};

export const getStartingChat = (address) => {
  return (dispatch) => {
    dispatch({
      type: "GET_STARTING_CHAT",
      data: address,
    });
  };
};

export const getOpponents = (opponents) => {
  opponents = opponents.slice().sort((a, b) => parseInt(b.Messages.MessageTimestamp._hex) - parseInt(a.Messages.MessageTimestamp._hex));
  return (dispatch) => {
    dispatch({
      type: "STORE_MESSAGE",
      data: opponents,
    });
  };
};

export const getStorage = (storage) => {
  return (dispatch) => {
    dispatch({
      type: "STORE_STORAGE",
      data: storage,
    });
  };
};

export const autoUpdater = (data) => {
  return (dispatch) => {
    dispatch({
      type: "AUTO_UPDATER",
      data: data,
    });
  };
};
