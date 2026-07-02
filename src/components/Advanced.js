import React from 'react';
import { Scaler } from "dapparatus";
import Ruler from "./Ruler";
import {CopyToClipboard} from "react-copy-to-clipboard";
import i18n from '../i18n';
import {
  Button,
  OutlineButton,
  Input,
  Flex,
  Box,
  Text,
  Card,
  QR as QRCode
} from 'rimble-ui'

export default class Advanced extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      privateKeyQr:false,
      seedPhraseHidden:true,
      privateKeyHidden:true
    }
  }
  render(){
    let {isVendor, balance, address, privateKey, changeAlert, changeView, goBack, setPossibleNewPrivateKey} = this.props

    let url = window.location.protocol+"//"+window.location.hostname
    if(window.location.port&&window.location.port!=80&&window.location.port!=443){
      url = url+":"+window.location.port
    }
    let qrSize = Math.min(document.documentElement.clientWidth,512)-90
    let qrValue = url+"/#"+privateKey
    let privateKeyQrDisplay = ""
    if (this.state.privateKeyQr) {
      privateKeyQrDisplay = (
        <Card width={1}>
          <Flex flexDirection="column" alignItems="center" p={3}>
            <QRCode value={qrValue} size={qrSize} renderAs="svg" />
          </Flex>
        </Card>
      );
    }

    let showingQr = "";
    if (this.state.showingQr) {
      showingQr = (
        <Card width={1} mt={3}>
          <Flex flexDirection="column" alignItems="center" p={3}>
            <QRCode value={this.state.showingQr} size={qrSize} renderAs="svg" />
          </Flex>
        </Card>
      );
    }

    let inputPrivateEyeButton = null;
    let inputPrivateWidth = 4 / 12;

    if (this.state.newPrivateKey) {
      inputPrivateEyeButton = (
        <Box width={2 / 12} px={2}>
          <Button width={1} onClick={() => { this.setState({ privateKeyHidden: !this.state.privateKeyHidden }); }}>
            <i className="fas fa-eye"></i>
          </Button>
        </Box>
      );
    } else {
      inputPrivateWidth = 6 / 12;
    }

    let inputPrivateKeyRow = (
      <Flex alignItems="center" mx={-2}>
        <Box width={inputPrivateWidth} px={2}>
          <Input
            type={this.state.privateKeyHidden ? "password" : "text"}
            autocorrect="off"
            autocapitalize="none"
            placeholder="private key"
            value={this.state.newPrivateKey || ''}
            onChange={event => this.setState({ newPrivateKey: event.target.value })}
          />
        </Box>
        {inputPrivateEyeButton}
        <Box width={6 / 12} px={2}>
          <Button width={1} onClick={()=>{
                    console.log(this.state.newPrivateKey)
                    if(this.state && this.state.newPrivateKey && this.state.newPrivateKey.length>=64&&this.state.newPrivateKey.length<=66){
                      //let pkutils = require("ethereum-mnemonic-privatekey-utils")
                      //const newPrivateKey = pkutils.getPrivateKeyFromMnemonic(newPrivateKey)
                      changeView('main')
                      let possibleNewPrivateKey = this.state.newPrivateKey
                      if(possibleNewPrivateKey.indexOf("0x")!=0){
                        possibleNewPrivateKey = "0x"+possibleNewPrivateKey
                      }
                      setPossibleNewPrivateKey(possibleNewPrivateKey)
                    }else{
                      changeAlert({type: 'warning', message: 'Invalid private key.'})
                    }
                  }}>
            <Scaler config={{startZoomAt:400,origin:"50% 50%"}}>
              <i className="fas fa-plus-square"/> {i18n.t('create')}
            </Scaler>
          </Button>
        </Box>
      </Flex>
    );

    let inputSeedEyeButton = null;
    let inputSeedWidth = 4 / 12;

    if (this.state.newSeedPhrase) {
      inputSeedEyeButton = (
        <Box width={2 / 12} px={2}>
          <Button width={1} onClick={() => { this.setState({ seedPhraseHidden: !this.state.seedPhraseHidden }); }}>
            <i className="fas fa-eye"></i>
          </Button>
        </Box>
      );
    } else {
      inputSeedWidth = 6 / 12;
    }

    let inputSeedRow = (
      <Flex alignItems="center" mx={-2} pt={3}>
        <Box width={inputSeedWidth} px={2}>
          <Input
            type={this.state.seedPhraseHidden ? "password" : "text"}
            autocorrect="off"
            autocapitalize="none"
            placeholder="seed phrase"
            value={this.state.newSeedPhrase || ''}
            onChange={event => this.setState({ newSeedPhrase: event.target.value })}
          />
        </Box>
        {inputSeedEyeButton}
        <Box width={6 / 12} px={2}>
          <Button width={1} onClick={()=>{
                    if(!this.state.newSeedPhrase){
                      changeAlert({type: 'warning', message: 'Invalid seed phrase.'})
                    }else{
                      let pkutils = require("ethereum-mnemonic-privatekey-utils")
                      const newPrivateKey = pkutils.getPrivateKeyFromMnemonic(this.state.newSeedPhrase)
                      changeView('main')
                      setPossibleNewPrivateKey("0x"+newPrivateKey)
                    }
                  }}>
            <Scaler config={{startZoomAt:400,origin:"50% 50%"}}>
              <i className="fas fa-plus-square"/> {i18n.t('create')}
            </Scaler>
          </Button>
        </Box>
      </Flex>
    );

    return (
      <Box mt={4}>
        <Box>
          <Text textAlign="center" width={1} fontWeight="bold">Learn More</Text>
          <Flex mx={-2} mb={3} mt={3}>
            <Box width={1 / 2} px={2}>
              <a href="https://github.com/austintgriffith/burner-wallet" style={{ color: "#FFFFFF" }} target="_blank" rel="noopener noreferrer">
                <OutlineButton width={1}>
                  <Scaler config={{ startZoomAt: 400, origin: "50% 50%" }}>
                    <i className="fas fa-code" /> {i18n.t('code')}
                  </Scaler>
                </OutlineButton>
              </a>
            </Box>
            <Box width={1 / 2} px={2}>
              <a href="https://medium.com/gitcoin/ethereum-in-emerging-economies-b235f8dac2f2" style={{ color: "#FFFFFF" }} target="_blank" rel="noopener noreferrer">
                <OutlineButton width={1}>
                  <Scaler config={{ startZoomAt: 400, origin: "50% 50%" }}>
                    <i className="fas fa-info" /> {i18n.t('about')}
                  </Scaler>
                </OutlineButton>
              </a>
            </Box>
          </Flex>
        </Box>

        <hr style={{ paddingTop: 20 }} />

        {privateKey && !isVendor &&
          <Box>
            <Text textAlign="center" width={1} fontWeight="bold">Private Key</Text>
            <Flex mx={-2} mb={3} mt={3}>
              <Box width={1 / 2} px={2}>
                <Button width={1} onClick={() => { this.setState({ privateKeyQr: !this.state.privateKeyQr }); }}>
                  <Scaler config={{ startZoomAt: 400, origin: "50% 50%" }}>
                    <i className="fas fa-key" /> {i18n.t('show')}
                  </Scaler>
                </Button>
              </Box>
              <CopyToClipboard text={privateKey}>
                <Box width={1 / 2} px={2} onClick={() => changeAlert({ type: 'success', message: 'Private Key copied to clipboard' })}>
                  <Button width={1}>
                    <Scaler config={{ startZoomAt: 400, origin: "50% 50%" }}>
                      <i className="fas fa-key" /> {i18n.t('copy')}
                    </Scaler>
                  </Button>
                </Box>
              </CopyToClipboard>
            </Flex>
            {privateKeyQrDisplay}
          </Box>
        }

        {privateKey &&
          <Box>
            <Box px={2}>
              <Button width={1} onClick={() => { changeView('burn-wallet'); }}>
                <Scaler config={{ startZoomAt: 400, origin: "50% 50%" }}>
                  <i className="fas fa-fire" /> {i18n.t('burn')}
                </Scaler>
              </Button>
            </Box>
            <hr style={{ paddingTop: 20 }} />
          </Box>
        }

        <Text textAlign="center" width={1} fontWeight="bold">Create Account</Text>
        {inputPrivateKeyRow}
        {inputSeedRow}

        <hr style={{ paddingTop: 20 }} />
        <Text textAlign="center" width={1} fontWeight="bold">Extra Tools</Text>

        <Flex mx={-2} mt={3}>
          <Box width={1 / 2} px={2}>
            <Input
              type="text"
              autocorrect="off"
              autocapitalize="none"
              placeholder="any text to encode"
              value={this.state.newQr || ''}
              onChange={event => this.setState({ newQr: event.target.value })}
            />
          </Box>
          <Box width={1 / 2} px={2}>
            <Button width={1} onClick={() => { this.setState({ showingQr: this.state.newQr }); }}>
              <Scaler config={{ startZoomAt: 400, origin: "50% 50%" }}>
                <i className="fas fa-qrcode" /> {i18n.t('advanced.to_qr')}
              </Scaler>
            </Button>
          </Box>
        </Flex>
        {showingQr}

        {isVendor &&
          <Box px={2} mt={3}>
            <Button width={1} onClick={() => { this.props.changeView("exchange"); }}>
              <Scaler config={{ startZoomAt: 400, origin: "50% 50%" }}>
                <i className="fas fa-key" /> Exchange
              </Scaler>
            </Button>
          </Box>
        }
      </Box>
    );
  }
}
