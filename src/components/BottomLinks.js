import React from 'react';
import { Scaler } from "dapparatus";
import { Box, OutlineButton } from 'rimble-ui';
import i18n from '../i18n';

export default ({ changeView }) => {
  return (
    <Box textAlign="center" className="bottom-text" mb={4}>
      <Scaler config={{ startZoomAt: 350, origin: "35% 50%", adjustedZoom: 1 }}>
        <OutlineButton
          icon="Build"
          width={0.5}
          onClick={() => { changeView('advanced'); }}
        >
          {i18n.t('advance')}
        </OutlineButton>
      </Scaler>
    </Box>
  );
};
