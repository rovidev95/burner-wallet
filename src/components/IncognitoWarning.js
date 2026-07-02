import React from 'react';
import { Box, Text } from 'rimble-ui';
import i18n from '../i18n';

export default function IncognitoWarning() {
  return (
    <Box
      p={3}
      mb={2}
      style={{
        backgroundColor: '#8B0000',
        border: '2px solid #FF4444',
        borderRadius: 4,
      }}
    >
      <Text fontSize={2} fontWeight="bold" color="#FFFFFF" mb={2}>
        {i18n.t('incognito.title')}
      </Text>
      <Text fontSize={1} color="#FFDDDD">
        {i18n.t('incognito.body')}
      </Text>
      <Text fontSize={1} color="#FFDDDD" mt={2}>
        {i18n.t('incognito.download_hint')}
      </Text>
    </Box>
  );
}
