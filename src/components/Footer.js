import React from 'react';
import { Box, Text } from 'rimble-ui';

const alertColors = {
  success: { bg: '#e6f7ee', color: '#1a7f4b' },
  warning: { bg: '#fff8e6', color: '#9a6b00' },
  danger: { bg: '#fdecea', color: '#b42318' },
  info: { bg: '#eef4ff', color: '#175cd3' },
};

export default ({ alert, changeAlert }) => {
  const palette = alertColors[alert.type] || alertColors.info;

  return (
    <Box
      style={{ zIndex: 2, cursor: 'pointer' }}
      className="footer"
      onClick={() => changeAlert(null)}
      textAlign="center"
      p={3}
    >
      <Box
        bg={palette.bg}
        color={palette.color}
        p={3}
        borderRadius={2}
        display="inline-block"
        maxWidth="90%"
      >
        <Text fontSize={2}>{alert.message}</Text>
      </Box>
    </Box>
  );
};
