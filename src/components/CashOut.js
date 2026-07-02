import React, { Component } from 'react';
import {
  Box,
  Button,
  Field,
  Input
} from 'rimble-ui';

const OFFRAMPACCOUNT = "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";

class CashOut extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateState = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    return (
      <Box textAlign="left" p={3}>
        <Box mt={4} mb={4}>
          <Field label="Initiate Wyre Transfer">
            <Input
              type="number"
              placeholder="0.00"
              value={this.state.amount || ''}
              ref={(input) => { this.amountInput = input; }}
              onChange={event => this.updateState('amount', event.target.value)}
            />
          </Field>
        </Box>
        <Button
          icon="PlayArrow"
          width={1}
          onClick={() => {
            this.props.changeView('loader');
            setTimeout(() => {
              window.location = "/" + OFFRAMPACCOUNT + ";" + this.state.amount + ";VENDOR%20CASH%20OUT";
            }, 100);
          }}
        >
          Start
        </Button>
      </Box>
    );
  }
}

export default CashOut;
