import React from 'react';
import { Scaler } from "dapparatus";
import Blockies from 'react-blockies';
import i18next from 'i18next';
import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Input
} from 'rimble-ui';

export default class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changingAllowed: {},
    };
  }

  render() {
    let { buttonStyle, contracts, tx, web3, vendors } = this.props;

    let vendorBlockie = "";
    if (this.state.newVendor) {
      vendorBlockie = <Blockies seed={this.state.newVendor} scale={5} />;
    }

    let vendorDisplay = [];
    for (let v in vendors) {
      let vendorButton = (
        <Button
          disabled={!vendors[v].isActive || !vendors[v].isAllowed}
          width={1}
          onClick={() => { window.location = "/vendors;" + vendors[v].vendor; }}
        >
          <Scaler config={{ startZoomAt: 600, origin: "10% 50%" }}>
            {vendors[v].name}
          </Scaler>
        </Button>
      );

      let vendorAllowedDisplay;
      if (this.state.changingAllowed[v]) {
        vendorAllowedDisplay = <i className="fas fa-cog fa-spin" />;
      } else if (vendors[v].isAllowed) {
        vendorAllowedDisplay = <i className="fas fa-lock-open" />;
      } else {
        vendorAllowedDisplay = <i className="fas fa-lock" />;
      }

      let vendorIsAllowed = (
        <Button
          width={1}
          onClick={() => {
            let changingAllowed = { ...this.state.changingAllowed };
            changingAllowed[v] = true;
            this.setState({ changingAllowed });
            tx(
              contracts[this.props.ERC20VENDOR].updateVendor(
                vendors[v].vendor,
                web3.utils.utf8ToHex(vendors[v].name),
                vendors[v].isActive,
                !vendors[v].isAllowed
              ),
              120000, 0, 0,
              () => {
                setTimeout(() => {
                  changingAllowed = { ...this.state.changingAllowed };
                  changingAllowed[v] = false;
                  this.setState({ changingAllowed });
                }, 1500);
              }
            );
          }}
        >
          <Scaler config={{ startZoomAt: 500, origin: "50% 50%" }}>
            {vendorAllowedDisplay}
          </Scaler>
        </Button>
      );

      let vendorActiveDisplay;
      if (this.state.changingAllowed[v]) {
        vendorActiveDisplay = <i className="fas fa-cog fa-spin" />;
      } else if (vendors[v].isActive) {
        vendorActiveDisplay = <i className="fas fa-thumbs-up" />;
      } else {
        vendorActiveDisplay = <i className="fas fa-thumbs-down" />;
      }

      let vendorIsActive = (
        <Button
          width={1}
          onClick={() => {
            let changingAllowed = { ...this.state.changingAllowed };
            changingAllowed[v] = true;
            this.setState({ changingAllowed });
            tx(
              contracts[this.props.ERC20VENDOR].updateVendor(
                vendors[v].vendor,
                web3.utils.utf8ToHex(vendors[v].name),
                !vendors[v].isActive,
                vendors[v].isAllowed
              ),
              120000, 0, 0,
              () => {
                setTimeout(() => {
                  changingAllowed = { ...this.state.changingAllowed };
                  changingAllowed[v] = false;
                  this.setState({ changingAllowed });
                }, 1500);
              }
            );
          }}
        >
          <Scaler config={{ startZoomAt: 500, origin: "50% 50%" }}>
            {vendorActiveDisplay}
          </Scaler>
        </Button>
      );

      vendorDisplay.push(
        <Flex key={v} alignItems="center" mx={-1} mb={2}>
          <Box width={2 / 12} px={1} textAlign="center">
            <Blockies seed={vendors[v].vendor.toLowerCase()} scale={5} />
          </Box>
          <Box width={6 / 12} px={1} textAlign="center">
            {vendorButton}
          </Box>
          <Box width={2 / 12} px={1} textAlign="center">
            {vendorIsActive}
          </Box>
          <Box width={2 / 12} px={1} textAlign="center">
            {vendorIsAllowed}
          </Box>
        </Flex>
      );
    }

    let addVendorText = this.state.addingVendor
      ? <><i className="fas fa-cog fa-spin" /> {i18next.t('admin.adding')}</>
      : <><i className="fas fa-user" /> {i18next.t('admin.add_vendor')}</>;

    return (
      <Card width={1}>
        {vendorDisplay}

        <Flex alignItems="flex-end" mx={-1} mt={3}>
          <Box width={1 / 12} px={1}>
            {vendorBlockie}
          </Box>
          <Box width={3 / 12} px={1}>
            <Field label="Address">
              <Input
                placeholder="0x..."
                value={this.state.newVendor || ''}
                onChange={event => this.setState({ newVendor: event.target.value })}
              />
            </Field>
          </Box>
          <Box width={4 / 12} px={1}>
            <Field label="Name">
              <Input
                placeholder="Joe's Pizza"
                value={this.state.newVendorName || ''}
                onChange={event => this.setState({ newVendorName: event.target.value })}
              />
            </Field>
          </Box>
          <Box width={4 / 12} px={1}>
            <Button
              width={1}
              onClick={() => {
                this.setState({ addingVendor: true });
                tx(
                  contracts[this.props.ERC20VENDOR].addVendor(
                    this.state.newVendor,
                    web3.utils.utf8ToHex(this.state.newVendorName)
                  ),
                  480000, 0, 0,
                  () => {
                    this.setState({ newVendor: "", newVendorName: "" });
                    setTimeout(() => { this.setState({ addingVendor: false }); }, 1500);
                  }
                );
              }}
            >
              <Scaler config={{ startZoomAt: 600, origin: "20% 50%" }}>
                {addVendorText}
              </Scaler>
            </Button>
          </Box>
        </Flex>
      </Card>
    );
  }
}
