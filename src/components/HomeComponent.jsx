import React from "react";
import ListComponent from "./ListComponent";
import ChatComponent from "./ChatComponent";
import { ethers, providers } from "ethers";
import undrawAuth from "../asset/undraw-auth.svg";
import Cookies from "universal-cookie";

import StartChatComponent from "./StartChatComponent";
import { connect } from "react-redux";
import {
  getTab,
  getStartingChat,
  getOpponents,
  getAddress,
  getSigner,
  getStorage,
} from "../redux/actions/getData";

import FloatingTxPending from "./FloatingTxPending";
import {
  contractAddress,
  chainIDHex,
  chainIDInt,
  chainName,
} from "../constants/API";
import CoreABI from "../contracts/abi/core.json";
import StorageABI from "../contracts/abi/storage.json";

const cookies = new Cookies();

class HomeComponent extends React.Component {
  state = {
    connected: false,
    falseNetwork: false,
    accountAddress: "",
    hasStorage: false,
    fetchedStorage: false,
    deployingHash: "",
    storageAddress: "",
  };

  componentDidMount() {
    if (parseInt(window.innerWidth, 10) > 700) {
      this.props.getTab("");
    } else {
      this.props.getTab("tab");
    }
  }

  handleGetStorage = async (signer) => {
    const checkStorage = new ethers.Contract(contractAddress, CoreABI, signer);
    const storage = await checkStorage.Storage();
    this.props.getStorage(storage);

    return storage;
  };

  handleFetching = async (signer) => {
    const getMessage = new ethers.Contract(
      this.state.storageAddress,
      StorageABI,
      signer
    );

    const message = await getMessage.Opponents();

    if (Array.isArray(message)) {
      this.props.getOpponents(message);
    }

    return message;
  };

  handleConnect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const account = await provider.send("eth_requestAccounts", []);
    const { chainId } = await provider.getNetwork();
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts[0] !== account[0]) {
        window.location.reload();
      }
    });

    provider.on("network", (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        window.location.reload();
      }
    });

    if (chainId !== chainIDInt) {
      this.setState({
        falseNetwork: true,
      });

      await provider.send("wallet_switchEthereumChain", [
        { chainId: chainIDHex },
      ]);
    }

    const signer = await provider.getSigner();
    const storage = await this.handleGetStorage(signer);

    this.props.getAddress(account[0]);
    this.props.getSigner(signer);

    this.setState({
      accountAddress: account[0],
      connected: true,
    });

    if (storage !== ethers.constants.AddressZero) {
      this.setState({
        hasStorage: true,
        storageAddress: storage,
      });

      const message = await this.handleFetching(signer);

      if (Array.isArray(message)) {
        this.setState({
          fetchedStorage: true,
        });
      }
    }
  };

  handleSwitchNetwork = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    try {
      await provider.send("wallet_switchEthereumChain", [
        { chainId: chainIDHex },
      ]);
      this.setState({
        falseNetwork: false,
      });
    } catch (e) {}
  };

  handleDeployStorage = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = await provider.getSigner();
    const deployStorage = new ethers.Contract(contractAddress, CoreABI, signer);
    const sendingTx = await deployStorage.DeployStorage();
    cookies.set("confirming", sendingTx.hash, { path: "/" });
    this.setState({
      deployingHash: sendingTx.hash,
    });

    const checking = await provider.waitForTransaction(sendingTx.hash);
    if (checking && checking.confirmations > 0) {
      const storage = await this.handleGetStorage(signer);
      if (storage !== ethers.constants.AddressZero) {
        this.setState({
          hasStorage: true,
          storageAddress: storage,
        });

        const message = await this.handleFetching(signer);
        if (Array.isArray(message)) {
          this.setState({
            fetchedStorage: true,
          });
        }
      }

      cookies.remove("confirming");
    }
  };

  render() {
    return (
      <>
        {this.state.connected &&
        this.state.hasStorage &&
        this.state.fetchedStorage ? (
          <>
            <div
              className="container-fluid"
              onKeyUp={(event) =>
                event.key === "Escape" ? this.props.getStartingChat("") : null
              }
              tabIndex="0"
            >
              <div className="row">
                <div className="col-12 col-md-4 d-block left-section overflow-custom">
                  <ListComponent />
                </div>
                <div className="col-12 col-md-8 d-block right-section">
                  {this.props.startingChat !== "" ? (
                    <ChatComponent />
                  ) : (
                    <StartChatComponent username={this.props.startingChat} />
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="connect-box">
              <div className="logo">
                <p className="logo-img">RESPONT</p>
                <div className="rounded shadow-sm">
                  <h5>Connect Wallet</h5>
                  <img src={undrawAuth} alt="Connect Web3 Wallet" />
                  <p>Connect to your web3 wallet to continue.</p>
                  {window.ethereum &&
                  !this.state.falseNetwork &&
                  !this.state.connected ? (
                    <button className="rounded" onClick={this.handleConnect}>
                      Connect Wallet
                    </button>
                  ) : window.ethereum &&
                    this.state.falseNetwork &&
                    !this.state.connected ? (
                    <>
                      <button
                        className="rounded"
                        onClick={this.handleSwitchNetwork}
                      >
                        Switch Network
                      </button>
                      <p className="text-danger">
                        Please change network to {chainName}
                      </p>
                    </>
                  ) : window.ethereum &&
                    this.state.connected &&
                    !this.state.hasStorage ? (
                    <>
                      <button
                        className="rounded"
                        onClick={this.handleDeployStorage}
                      >
                        Deploy Storage
                      </button>
                      <p className="text-danger">
                        You need to deploy your storage.
                      </p>
                    </>
                  ) : (
                    <button
                      className="rounded"
                      onClick={this.handleConnect}
                      disabled={true}
                    >
                      Connect Wallet
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {cookies.get("confirming") ? (
          <FloatingTxPending hash={cookies.get("confirming")} />
        ) : null}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tab: state.user.tab,
    startingChat: state.user.startingChat,
  };
};

const mapDispatchToProps = {
  getTab,
  getStartingChat,
  getOpponents,
  getAddress,
  getSigner,
  getStorage,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
