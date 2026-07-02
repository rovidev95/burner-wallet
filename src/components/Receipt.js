import React from 'react';
import Badge from './Badge';
import { Blockie } from "dapparatus";
import i18n from '../i18n';
import axios from 'axios';
import {
  Box,
  Flex,
  Icon,
  Link,
  Text
} from 'rimble-ui';

const BockieSize = 12;

export default class Receipt extends React.Component {
  componentDidMount() {
    if (this.props.receipt && this.props.receipt.daiposOrderId) {
      let url = "https://us-central1-daipos.cloudfunctions.net/transactionBuffer?orderId="
        + this.props.receipt.daiposOrderId
        + "&txHash=" + this.props.receipt.result.transactionHash
        + "&networkId=100";
      axios.get(url);
    }
    if (this.props.receipt && this.props.receipt.params && this.props.receipt.params.callback) {
      let returnObject = {
        to: this.props.receipt.to,
        from: this.props.receipt.from,
        amount: this.props.receipt.amount,
        transactionHash: this.props.receipt.result.transactionHash,
        status: this.props.receipt.result.status,
        data: this.props.receipt.result.v,
      };
      setTimeout(() => {
        window.location = this.props.receipt.params.callback + "?receipt=" + (encodeURI(JSON.stringify(returnObject)));
      }, 2500);
    }
  }

  render() {
    let { receipt, dollarDisplay } = this.props;

    let sendAmount;
    if (receipt.badge) {
      sendAmount = (
        <Badge key="sentbadge" id={receipt.badge.id} image={receipt.badge.image} />
      );
    } else {
      sendAmount = (
        <Text fontSize={5} pt={4}>
          <span style={{ opacity: 0.15 }}>-</span>
          {dollarDisplay(receipt.amount)}
          <span style={{ opacity: 0.15 }}>-&gt;</span>
        </Text>
      );
    }

    return (
      <Box>
        <Flex flexDirection="column" alignItems="center" width={1}>
          <Icon name="CheckCircle" color="#39e917" size={96} style={{ opacity: 0.7 }} />
        </Flex>

        <Flex alignItems="center" justifyContent="space-between" width={1} mt={4}>
          <Box width={1 / 3} textAlign="center">
            <Blockie address={receipt.from} config={{ size: BockieSize }} />
          </Box>
          <Box width={1 / 3} textAlign="center">
            {sendAmount}
          </Box>
          <Box width={1 / 3} textAlign="center">
            <Blockie address={receipt.to} config={{ size: BockieSize }} />
          </Box>
        </Flex>

        {receipt.message && (
          <Text textAlign="center" mt={4} fontSize={4}>
            {receipt.message}
          </Text>
        )}

        <Box name="theVeryBottom" textAlign="center" className="bottom-text" mt={4}>
          <Link color="#FFFFFF" onClick={() => { this.props.goBack(); }}>
            <Icon name="Close" /> {i18n.t('done')}
          </Link>
        </Box>
      </Box>
    );
  }
}
