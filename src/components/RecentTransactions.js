import React from 'react';
import { Blockie } from "dapparatus";
import Ruler from "./Ruler";
import { Scaler } from "dapparatus";
import { Box, Button, Flex, Icon, Text } from "rimble-ui";

export default ({ dollarDisplay, view, max, buttonStyle, ERC20TOKEN, address, recentTxs, block, changeView }) => {
  let txns = [];
  let count = 0;
  if (!max) max = 9999;

  for (let r in recentTxs) {
    let thisValue = parseFloat(recentTxs[r].value);
    if (thisValue > 0.0) {
      let extraUp = view === "receive" ? -10 : 0;
      let extraIcon = (
        <Box position="absolute" right={-3} top={extraUp}>
          <Button
            icon="Chat"
            width={1}
            style={recentTxs[r].data ? buttonStyle.primary : buttonStyle.secondary}
          />
        </Box>
      );

      let dollarView;
      if (ERC20TOKEN) {
        if (recentTxs[r].token) {
          dollarView = (
            <span>
              <span style={{ opacity: 0.33 }}>-</span>
              {dollarDisplay(recentTxs[r].value)}
              <span style={{ opacity: 0.33 }}>-&gt;</span>
            </span>
          );
        } else {
          dollarView = (
            <span style={{ opacity: 0.5, fontSize: 14 }}>
              {dollarDisplay(recentTxs[r].value)}
            </span>
          );
        }
      } else {
        dollarView = (
          <span>
            <span style={{ opacity: 0.33 }}>-</span>
            {dollarDisplay(recentTxs[r].value)}
            <span style={{ opacity: 0.33 }}>-&gt;</span>
          </span>
        );
      }

      let toBlockie = (
        <Blockie address={recentTxs[r].to} config={{ size: 4 }} />
      );
      if (recentTxs[r].to === address && recentTxs[r].data) {
        let message = recentTxs[r].data;
        let limit = 18;
        if (message.length > limit) {
          message = message.substring(0, limit - 3) + "...";
        }
        toBlockie = <Text fontSize={2}>{message}</Text>;
      }

      if (count++ < max) {
        txns.push(
          <hr key={"ruler" + recentTxs[r].hash} style={{ color: "#DFDFDF", marginTop: 0, marginBottom: 7 }} />
        );

        let blockAge = block - recentTxs[r].blockNumber;
        let onClick = () => {
          if (recentTxs[r].from === address) {
            changeView("account_" + recentTxs[r].to);
          } else {
            changeView("account_" + recentTxs[r].from);
          }
        };

        if (blockAge <= 1 && recentTxs[r].to === address) {
          txns.push(
            <Flex
              key={"green" + recentTxs[r].hash}
              alignItems="center"
              style={{ position: 'relative', cursor: 'pointer', paddingTop: 10, paddingBottom: 10 }}
              onClick={onClick}
            >
              <Box width={3 / 12} textAlign="center">
                <Icon name="CheckCircle" color="#39e917" size={48} style={{ opacity: 0.7 }} />
              </Box>
              <Box width={3 / 12} textAlign="center" pt={2}>
                <Blockie address={recentTxs[r].from} config={{ size: 7 }} />
              </Box>
              <Box width={3 / 12} textAlign="center" pt={3}>
                <Scaler config={{ startZoomAt: 400, origin: "50% 50%" }}>
                  {dollarView}
                </Scaler>
              </Box>
              <Box width={3 / 12} textAlign="center" pt={3}>
                {toBlockie}
              </Box>
            </Flex>
          );
        } else {
          txns.push(
            <Flex
              key={recentTxs[r].hash}
              alignItems="center"
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={onClick}
            >
              {extraIcon}
              <Box width={3 / 12} px={1} textAlign="center">
                <Blockie address={recentTxs[r].from} config={{ size: 4 }} />
              </Box>
              <Box width={3 / 12} px={1} textAlign="center">
                <Scaler config={{ startZoomAt: 600, origin: "25% 50%", adjustedZoom: 1 }}>
                  {dollarView}
                </Scaler>
              </Box>
              <Box width={3 / 12} px={1} textAlign="center">
                {toBlockie}
              </Box>
              <Box width={3 / 12} px={1} textAlign="center">
                <Scaler config={{ startZoomAt: 600, origin: "25% 50%", adjustedZoom: 1 }}>
                  <Text ml={2} mt={-2} opacity={0.4} fontSize={1}>
                    {cleanTime(blockAge * 5)} ago
                  </Text>
                </Scaler>
              </Box>
            </Flex>
          );
        }
      }
    }
  }

  if (txns.length > 0) {
    return <Box mt={4}>{txns}</Box>;
  }
  return <span />;
};

let cleanTime = (s) => {
  if (s < 60) return s + "s";
  if (s / 60 < 60) return Math.round(s / 6) / 10 + "m";
  return Math.round((s / 60 / 6) / 24) / 10 + "d";
};
