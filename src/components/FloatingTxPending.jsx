import React from "react";
import { ethers } from "ethers";
import { chainExplorer } from "../constants/API";
import Cookies from "universal-cookie";

const cookies = new Cookies();

class FloatingTxPending extends React.Component {
  state = {
    confirmation: 0,
    visible: true,
  };

  async componentDidMount() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const checking = await provider.waitForTransaction(this.props.hash);
    if (checking && checking.confirmations > 0) {
      this.setState({ confirmation: checking.confirmations }, () => {
        window.setTimeout(() => {
          this.setState({ visible: false });
        }, 5000);
      });
      cookies.remove("confirming");
    }
  }

  render() {
    return this.state.visible ? (
      <a
        className={`alert-box ${
          this.state.confirmation === 0
            ? `bg-warning text-dark`
            : `alert-box-white bg-success`
        }`}
        href={`${chainExplorer}/tx/${this.props.hash}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {this.state.confirmation === 0 ? <div className="loader"></div> : null}
        <p className="d-inline-block">
          Transaction is {this.state.confirmation === 0 ? `pending` : `mined`}
        </p>
      </a>
    ) : null;
  }
}

export default FloatingTxPending;
