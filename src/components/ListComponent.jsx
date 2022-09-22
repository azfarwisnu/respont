import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import {
  getTab,
  getStartingChat,
  getOpponents,
  autoUpdater,
} from "../redux/actions/getData";
import { ethers } from "ethers";
import Modal from "react-bootstrap/Modal";
import Axios from "axios";
import Cookies from "universal-cookie";

import { contractAddress, API } from "../constants/API";
import CoreABI from "../contracts/abi/core.json";
import StorageABI from "../contracts/abi/storage.json";
import avatarBroken from "../asset/avatar-broken.jpg";

const cookies = new Cookies();

class ListComponent extends React.Component {
  state = {
    search: "",
    profile: "",
    modalUpload: false,
    file: {},
    images: {},
    uploading: false,
  };

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state.images);

    if (prevState.search !== this.state.search) {
      if (ethers.utils.isAddress(this.state.search)) {
        this.getPicture(this.state.search).then((image) => {
          let profiles = { ...this.state.images };
          profiles[this.state.search] = image;
          this.setState({
            images: profiles,
          });
        });
      }
    }

    if (prevProps.opponents !== this.props.opponents) {
      this.saveProfile(this.props.opponents);
    }
  }

  componentDidMount() {
    this.handleAutoUpdate();
    this.getProfile();
    this.saveProfile(this.props.opponents);
  }

  getProfile = async () => {
    const getProfile = new ethers.Contract(
      this.props.storage,
      StorageABI,
      this.props.signer
    );

    const profile = await getProfile.GetPicture();

    this.setState({
      profile,
    });
  };

  handleAutoUpdate = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const contract = new ethers.Contract(contractAddress, CoreABI, provider);

    contract.on("Sent", async (Sender, Receiver) => {
      if (
        Receiver.toLowerCase() === this.props.address.toLowerCase() ||
        Sender.toLowerCase() === this.props.address.toLowerCase()
      ) {
        const checkStorage = new ethers.Contract(
          this.props.storage,
          StorageABI,
          this.props.signer
        );

        const storage = await checkStorage.Opponents();

        this.props.getOpponents(storage);
      }

      if (
        Receiver.toLowerCase() === this.props.startingChat.toLowerCase() ||
        Sender.toLowerCase() === this.props.startingChat.toLowerCase()
      ) {
        this.props.autoUpdater({
          FromAddress: Sender,
          ToAddress: Receiver,
          MessageTimestamp: parseInt(Date.now() / 1000),
        });
      }
    });
  };

  toChatUser = (address) => {
    if (parseInt(window.innerWidth, 10) > 700) {
      this.props.getTab("");
      this.props.getStartingChat(address);
    } else {
      this.props.getTab("chat");
      this.props.getStartingChat(address);
    }
  };

  searchInputHandler = (event) => {
    const value = event.target.value;

    this.setState({ search: value });
  };

  getPicture = (address) => {
    const checkPicture = new ethers.Contract(
      contractAddress,
      CoreABI,
      this.props.signer
    );

    const picture = checkPicture.GetPicture(address);
    let profile = picture.then((data) => {
      return data;
    });
    return profile;
  };

  saveProfile = (list) => {
    console.log(list);
    list.forEach((val) => {
      this.getPicture(val.Opponent).then((image) => {
        let profiles = { ...this.state.images };
        profiles[val.Opponent] = image;
        this.setState({
          images: profiles,
        });
      });
    });
  };

  renderList = () => {
    let search = this.state.search.toLowerCase().replace(/\s/g, "");

    if (search.length > 0 && !ethers.utils.isAddress(search)) {
      let filter = this.props.opponents.filter((filterOne) =>
        filterOne.Opponent.toLowerCase().includes(search)
      );
      if (filter.length > 0) {
        return (
          <div>
            {filter.map((val) => {
              return (
                <div
                  className="list-box"
                  onClick={() => this.toChatUser(`${val.Opponent}`)}
                >
                  <img
                    src={
                      "https://web3-storage.infura-ipfs.io/ipfs/QmXUBCME22T5q7fmzEHZ3nAjF4dKSDeVgpFN7HDgnCrqMZ"
                    }
                    alt={val.Opponent}
                    className="rounded-circle"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = avatarBroken;
                    }}
                  />
                  <p className="time">
                    {moment
                      .unix(parseInt(val.Messages.MessageTimestamp._hex))
                      .format("HH:mm")}
                  </p>
                  <div className="right">
                    <div className="opponent">
                      <p className="address">{val.Opponent.toLowerCase()}</p>
                    </div>
                    <div className="preview">
                      <p>
                        <b>
                          {val.Messages.FromAddress.toLowerCase() ===
                          this.props.address.toLowerCase()
                            ? "You:"
                            : null}
                        </b>{" "}
                        {val.Messages.MediaLink.length > 0 ? (
                          <i className="bi bi-image"></i>
                        ) : null}{" "}
                        {val.Messages.MessageText}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
    } else if (ethers.utils.isAddress(search)) {
      return search !== this.props.address.toLowerCase() ? (
        <div>
          <div className="list-box" onClick={() => this.toChatUser(search)}>
            <img
              src={
                this.state.images[search]
                  ? this.state.images[search]
                  : avatarBroken
              }
              alt={search}
              className="rounded-circle"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = avatarBroken;
              }}
            />
            <div className="right">
              <div className="opponent mt-3">
                <b className="address">{search.toLowerCase()}</b>
              </div>
            </div>
          </div>
        </div>
      ) : null;
    } else {
      return (
        <div>
          {this.props.opponents.map((val, i) => {
            return (
              <>
                {i === 0 && !this.state.search ? (
                  <div className="list-day">
                    <hr />
                    <p>
                      {moment
                        .unix(parseInt(val.Messages.MessageTimestamp._hex))
                        .format("dddd, Do MMMM YYYY")}
                    </p>
                  </div>
                ) : moment
                    .unix(parseInt(val.Messages.MessageTimestamp._hex))
                    .format("dddd, Do MMMM YYYY") !==
                    moment
                      .unix(
                        parseInt(
                          this.props.opponents[i - 1].Messages.MessageTimestamp
                            ._hex
                        )
                      )
                      .format("dddd, Do MMMM YYYY") && !this.state.search ? (
                  <div className="list-day">
                    <hr />
                    <p>
                      {moment
                        .unix(parseInt(val.Messages.MessageTimestamp._hex))
                        .format("dddd, Do MMMM YYYY")}
                    </p>
                  </div>
                ) : null}
                <div
                  className="list-box"
                  onClick={() => this.toChatUser(`${val.Opponent}`)}
                >
                  <img
                    src={this.state.images[val.Opponent]}
                    alt={val.Opponent}
                    className="rounded-circle"
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = avatarBroken;
                    }}
                  />
                  <p className="time">
                    {moment
                      .unix(parseInt(val.Messages.MessageTimestamp._hex))
                      .format("HH:mm")}
                  </p>
                  <div className="right">
                    <div className="opponent">
                      <p className="address">{val.Opponent.toLowerCase()}</p>
                    </div>
                    <div className="preview">
                      <p>
                        <b>
                          {val.Messages.FromAddress.toLowerCase() ===
                          this.props.address.toLowerCase()
                            ? "You:"
                            : null}
                        </b>{" "}
                        {val.Messages.MediaLink.length > 0 ? (
                          <i className="bi bi-image"></i>
                        ) : null}{" "}
                        {val.Messages.MessageText}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      );
    }
  };

  closeModal = () => {
    if (!this.state.uploading) {
      this.setState({
        file: "",
        preview: "",
        modalUpload: false,
      });
    }
  };

  fileUploadHandler = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onloadend = function() {
      this.setState({
        preview: reader.result,
        file: e.target.files[0],
      });
    }.bind(this);
  };

  submitProfile = async () => {
    const formData = new FormData();

    formData.append("files", this.state.file);

    this.setState({
      uploading: true,
    });

    const result = await Axios.post(`${API}/multifiles`, formData);

    this.setState({
      uploading: false,
    });

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const setupProfile = new ethers.Contract(
      this.props.storage,
      StorageABI,
      this.props.signer
    );

    const savingPicture = await setupProfile.ChangePicture(result.data.hash[0]);

    cookies.set("confirming", savingPicture.hash, { path: "/" });

    const checking = await provider.waitForTransaction(savingPicture.hash);
    if (checking && checking.confirmations > 0) {
      cookies.remove("confirming");

      this.setState({
        message: "",
        pendingConfirmation: false,
        hash: "",
        profile: result.data.hash[0],
      });
    }
  };

  render() {
    return (
      <>
        <Modal show={this.state.modalUpload} onHide={this.closeModal} centered>
          <div className="modal-profile">
            <label for="image-uploader">
              <img
                className="rounded-circle d-block"
                src={
                  this.state.preview ? this.state.preview : this.state.profile
                }
                alt={this.state.address}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = avatarBroken;
                }}
              />
            </label>
            <input
              type="file"
              id="image-uploader"
              accept="image/*"
              onChange={this.fileUploadHandler}
            />
            <button className="d-block rounded" onClick={this.submitProfile}>
              Submit
            </button>
          </div>
        </Modal>

        <div>
          {/*profile section */}
          <div className="row">
            <div className="section-head col-md-4 position-fixed">
              <div className="profile-box">
                <img
                  src={this.state.profile}
                  alt={this.props.address.toLowerCase()}
                  className="rounded-circle"
                  onClick={() => {
                    this.setState({ modalUpload: true });
                    this.toChatUser("");
                  }}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = avatarBroken;
                  }}
                />
                <div>
                  <p>{this.props.address.toLowerCase()}</p>
                </div>
              </div>
              <hr />
              <div className="search-box">
                <i className="bi bi-search text-white"></i>
                <input
                  className=""
                  type="text"
                  placeholder="Search address..."
                  name="search"
                  onChange={this.searchInputHandler}
                />
              </div>
            </div>
            {this.renderList()}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tab: state.user.tab,
    startingChat: state.user.startingChat,
    opponents: state.user.opponents,
    signer: state.user.signer,
    storage: state.user.storage,
    address: state.user.address,
  };
};

const mapDispatchToProps = {
  getTab,
  getStartingChat,
  getOpponents,
  autoUpdater,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListComponent);
