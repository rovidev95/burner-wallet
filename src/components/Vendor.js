import React from 'react';
import { Scaler } from "dapparatus";
import i18n from '../i18n';
import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Input,
  Text
} from 'rimble-ui';

let metaReceiptTracker = {};

export default class Vendor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changingAvailable: {}
    };
  }

  render() {
    let { dollarDisplay, buttonStyle, contracts, vendor, tx, web3 } = this.props;

    let products = [];
    for (let p in this.props.products) {
      let prod = this.props.products[p];
      if (prod.exists) {
        let productAvailableDisplay;
        if (this.state.changingAvailable[p]) {
          productAvailableDisplay = <i className="fas fa-cog fa-spin" />;
        } else if (prod.isAvailable) {
          productAvailableDisplay = <i className="fas fa-eye" />;
        } else {
          productAvailableDisplay = <i className="fas fa-eye-slash" />;
        }

        let opacity = prod.isAvailable ? 1.0 : 0.5;

        products.push(
          <Flex key={p} alignItems="center" mx={-1} mb={2} style={{ opacity }}>
            <Box width={6 / 12} px={1}>
              <Text>{web3.utils.hexToUtf8(prod.name)}</Text>
            </Box>
            <Box width={4 / 12} px={1}>
              <Text>{dollarDisplay(web3.utils.fromWei(prod.cost, 'ether'))}</Text>
            </Box>
            <Box width={2 / 12} px={1}>
              <Button
                width={1}
                onClick={() => {
                  let changingAvailable = { ...this.state.changingAvailable };
                  changingAvailable[p] = true;
                  this.setState({ changingAvailable });
                  tx(
                    contracts[this.props.ERC20VENDOR].addProduct(
                      prod.id, prod.name, prod.cost, !prod.isAvailable
                    ),
                    240000, 0, 0,
                    () => {
                      changingAvailable = { ...this.state.changingAvailable };
                      changingAvailable[p] = false;
                      this.setState({ changingAvailable });
                      if (this.poll) setTimeout(this.poll.bind(this), 444);
                    }
                  );
                }}
              >
                <Scaler config={{ startZoomAt: 500, origin: "50% 50%" }}>
                  {productAvailableDisplay}
                </Scaler>
              </Button>
            </Box>
          </Flex>
        );
      }
    }

    let venderButtonText;
    if (this.state.changingActive) {
      venderButtonText = <><i className="fas fa-cog fa-spin" /> {i18n.t('vendor.updating')}</>;
    } else if (vendor.isActive) {
      venderButtonText = <><i className="fas fa-thumbs-up" /> {i18n.t('vendor.open')}</>;
    } else {
      venderButtonText = <><i className="fas fa-thumbs-down" /> {i18n.t('vendor.closed')}</>;
    }

    let addProductText = this.state.addingProduct
      ? <><i className="fas fa-cog fa-spin" /> {i18n.t('vendor.adding')}</>
      : <><i className="fas fa-plus-square" /> {i18n.t('vendor.add_product')}</>;

    return (
      <Card width={1}>
        <Flex alignItems="center" mx={-1} mb={3}>
          <Box width={8 / 12} px={1} textAlign="center">
            <Text fontSize={5} fontWeight="bold">{web3.utils.hexToUtf8(vendor.name)}</Text>
          </Box>
          <Box width={4 / 12} px={1}>
            <Button
              width={1}
              onClick={() => {
                this.setState({ changingActive: true });
                let setActiveTo = !vendor.isActive;
                tx(
                  contracts[this.props.ERC20VENDOR].activateVendor(setActiveTo),
                  120000, 0, 0,
                  () => {
                    setTimeout(() => { this.setState({ changingActive: false }); }, 1500);
                  }
                );
              }}
            >
              <Scaler config={{ startZoomAt: 500, origin: "40% 50%" }}>
                {venderButtonText}
              </Scaler>
            </Button>
          </Box>
        </Flex>

        {products}

        <Flex alignItems="flex-end" mx={-1} mt={3}>
          <Box width={4 / 12} px={1}>
            <Field label="Name">
              <Input
                placeholder="Name..."
                value={this.state.newProductName || ''}
                onChange={event => this.setState({ newProductName: event.target.value })}
              />
            </Field>
          </Box>
          <Box width={4 / 12} px={1}>
            <Field label="Price">
              <Input
                type="number"
                step="0.1"
                placeholder="0.00"
                value={this.state.newProductAmount || ''}
                onChange={event => this.setState({ newProductAmount: event.target.value })}
              />
            </Field>
          </Box>
          <Box width={4 / 12} px={1}>
            <Button
              width={1}
              onClick={() => {
                if (!this.state.newProductName || !this.state.newProductAmount) {
                  this.props.changeAlert({ type: 'warning', message: 'Please enter a valid product and price.' });
                } else {
                  let nextId = this.props.products.length;
                  this.setState({ addingProduct: true });
                  tx(
                    contracts[this.props.ERC20VENDOR].addProduct(
                      nextId,
                      web3.utils.utf8ToHex(this.state.newProductName),
                      web3.utils.toWei("" + this.state.newProductAmount, 'ether'),
                      true
                    ),
                    240000, 0, 0,
                    (receipt) => {
                      if (receipt && receipt.transactionHash && !metaReceiptTracker[receipt.transactionHash]) {
                        metaReceiptTracker[receipt.transactionHash] = true;
                        this.setState({ addingProduct: false, newProductAmount: "", newProductName: "" });
                        if (this.poll) setTimeout(this.poll.bind(this), 100);
                      }
                    }
                  );
                }
              }}
            >
              <Scaler config={{ startZoomAt: 650, origin: "20% 50%" }}>
                {addProductText}
              </Scaler>
            </Button>
          </Box>
        </Flex>
      </Card>
    );
  }
}
