import React from 'react';
import Ruler from "./Ruler";
import i18n from '../i18n';
import {
  Box,
  Button,
  Flex,
  Text
} from 'rimble-ui';

export default ({ mainStyle, goBack, burnWallet }) => {
  return (
    <Box>
      <Text textAlign="center" width={1} fontWeight="bold" fontSize={6}>
        {i18n.t('burn_wallet.burn_private_key_question')}
      </Text>
      <Text textAlign="center" mt={4} width={1} fontWeight="bold" fontSize={4}>
        {i18n.t('burn_wallet.disclaimer')}
      </Text>
      <Ruler />
      <Flex mx={-2}>
        <Box width={1 / 2} px={2}>
          <Button
            icon="ArrowBack"
            width={1}
            onClick={goBack}
          >
            {i18n.t('burn_wallet.cancel')}
          </Button>
        </Box>
        <Box width={1 / 2} px={2}>
          <Button
            icon="Whatshot"
            width={1}
            bg="#c53838"
            onClick={burnWallet}
          >
            {i18n.t('burn_wallet.burn')}
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};
