import React from 'react';
import Ruler from "./Ruler";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  Box,
  Flex,
  Input,
  QR as QRCode
} from 'rimble-ui';

export default class ShareLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false
    };
  }

  render() {
    let port = window.location.port;
    if (port && port !== "80") {
      port = ":" + port;
    } else {
      port = "";
    }

    let url = window.location.protocol + "//" + window.location.hostname + port;
    let qrValue = url + "/" + this.props.sendLink + ";" + this.props.sendKey;
    let qrSize = Math.min(document.documentElement.clientWidth, 512) - 90;

    return (
      <div>
        <CopyToClipboard text={qrValue} onCopy={() => {
          this.props.changeAlert({ type: 'success', message: 'Link copied to clipboard' });
        }}>
          <Box style={{ cursor: "pointer" }}>
            <Flex flexDirection="column" alignItems="center" p={3}>
              <QRCode value={qrValue} size={qrSize} renderAs="svg" />
            </Flex>
            <Ruler />
            <Box px={3}>
              <Input type="url" readOnly value={qrValue} width={1} />
            </Box>
          </Box>
        </CopyToClipboard>
      </div>
    );
  }
}
