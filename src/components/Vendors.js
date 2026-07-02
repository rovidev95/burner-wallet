import React from 'react';
import { Scaler } from "dapparatus";
import Blockies from 'react-blockies';
import {
  Box,
  Button,
  Card,
  Flex,
  Icon,
  QR as QRCode,
  Text
} from 'rimble-ui';

let interval;

export default class Vendors extends React.Component {
  constructor(props) {
    super(props);
    let vendor = false;
    if (window.location.pathname.indexOf("/vendors;") === 0) {
      vendor = window.location.pathname.replace("/vendors;", "");
      window.history.pushState({}, "", "/");
    }
    this.state = {
      vendor: vendor,
      vendorObject: false,
      loading: false,
      showQR: {}
    };
  }

  componentDidMount() {
    interval = setInterval(this.poll.bind(this), 3000);
    setTimeout(this.poll.bind(this), 444);
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  async poll() {
    let id = 0;
    if (this.state.vendor) {
      if (!this.state.vendorObject) {
        let vendorData = await this.props.contracts[this.props.ERC20VENDOR].vendors(this.state.vendor).call();
        vendorData.name = this.props.web3.utils.hexToUtf8(vendorData.name);
        this.setState({ vendorObject: vendorData });
      }
      let products = [];
      let found = true;
      while (found) {
        let nextProduct = await this.props.contracts[this.props.ERC20VENDOR].products(this.state.vendor, id).call();
        if (nextProduct.exists) {
          products[id++] = nextProduct;
        } else {
          found = false;
        }
      }
      this.setState({ products, loading: false });
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    let { mainStyle, vendors, dollarDisplay, vendorObject } = this.props;
    let { vendor } = this.state;

    let url = window.location.protocol + "//" + window.location.hostname;
    if (window.location.port && window.location.port !== 80 && window.location.port !== 443) {
      url = url + ":" + window.location.port;
    }

    let correctVendorObject = this.state.vendorObject || vendorObject;
    let products = [];
    let vendorDisplay = [];

    if (vendor) {
      if (correctVendorObject) {
        products.push(
          <Card key="vendor-header" width={1} mb={3}>
            <Box position="relative">
              <Box
                position="absolute"
                left={0}
                top={0}
                style={{ fontSize: 42, cursor: 'pointer', zIndex: 1, padding: 3 }}
                onClick={() => { this.setState({ vendor: false }); }}
              >
                <Icon name="ArrowBack" />
              </Box>
              <Text textAlign="center" width={1} fontSize={4}>
                <Scaler config={{ startZoomAt: 500, origin: "80% 50%", adjustedZoom: 1 }}>
                  {correctVendorObject.name}
                </Scaler>
              </Text>
            </Box>
          </Card>
        );
      }

      let qrSize = Math.min(document.documentElement.clientWidth, 512) - 90;
      let correctProducts = this.state.products || this.props.products;

      for (let p in correctProducts) {
        let prod = correctProducts[p];
        if (prod.exists && prod.isAvailable) {
          let theName = this.props.web3.utils.hexToUtf8(prod.name);
          let theAmount = this.props.web3.utils.fromWei(prod.cost, 'ether');
          let productLocation = "/" + vendor + ";" + theAmount + ";" + theName.replace(/#/g, "%23").replace(/;/g, "%3B").replace(/:/g, "%3A").replace(/\//g, "%2F") + ";" + correctVendorObject.name + ":";
          productLocation = encodeURI(productLocation);
          let qrValue = url + productLocation;

          let toggleQR = () => {
            let showQR = { ...this.state.showQR };
            showQR[p] = !showQR[p];
            this.setState({ showQR });
          };

          let extraQR = null;
          if (this.state.showQR[p]) {
            extraQR = (
              <Card width={1} mt={3} pt={4} onClick={toggleQR}>
                <Flex flexDirection="column" alignItems="center">
                  <QRCode value={qrValue} size={qrSize} renderAs="svg" />
                  <Text textAlign="center" mt={3}>
                    {correctVendorObject.name} {theName}: {dollarDisplay(theAmount)}
                  </Text>
                </Flex>
              </Card>
            );
          }

          products.push(
            <Box key={p}>
              <Flex alignItems="center" mx={-1} py={3} style={{ borderBottom: "1px solid #dddddd" }}>
                <Box width={1 / 12} px={1} onClick={toggleQR} style={{ cursor: 'pointer' }}>
                  <Icon name="CropFree" />
                </Box>
                <Box width={4 / 12} px={1}>{theName}</Box>
                <Box width={3 / 12} px={1}>${dollarDisplay(theAmount)}</Box>
                <Box width={4 / 12} px={1}>
                  <Button
                    width={1}
                    onClick={() => {
                      this.setState({ loading: true, products: false, vendor: false }, () => {
                        window.location = productLocation;
                      });
                    }}
                  >
                    <Scaler config={{ startZoomAt: 500, origin: "40% 50%" }}>
                      Purchase
                    </Scaler>
                  </Button>
                </Box>
              </Flex>
              {extraQR}
            </Box>
          );
        }
      }

      if (vendorObject) {
        let qrValue = url + "/vendors;" + this.state.vendor;
        products.push(
          <Card key="vendor-qr" width={1} mt={3} pt={4}>
            <Flex flexDirection="column" alignItems="center">
              <QRCode value={qrValue} size={qrSize} renderAs="svg" />
              <Text textAlign="center" mt={3}>{vendorObject.name}</Text>
            </Flex>
          </Card>
        );
      }
    } else {
      for (let v in vendors) {
        if (vendors[v].isAllowed && vendors[v].isActive) {
          vendorDisplay.push(
            <Flex key={v} alignItems="center" mx={-1} mb={2}>
              <Box width={2 / 12} px={1} textAlign="center">
                <Blockies seed={vendors[v].vendor.toLowerCase()} scale={5} />
              </Box>
              <Box width={10 / 12} px={1} textAlign="center">
                <Button
                  disabled={!vendors[v].isActive}
                  width={1}
                  onClick={() => {
                    this.setState({
                      loading: true,
                      vendor: vendors[v].vendor,
                      vendorObject: vendors[v]
                    }, () => { this.poll(); });
                  }}
                >
                  <Scaler config={{ startZoomAt: 600, origin: "10% 50%" }}>
                    {vendors[v].name}
                  </Scaler>
                </Button>
              </Box>
            </Flex>
          );
        }
      }
    }

    return (
      <Box>
        {vendorDisplay}
        {products}
      </Box>
    );
  }
}
