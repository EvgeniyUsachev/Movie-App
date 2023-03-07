import React from 'react';
import { Offline } from 'react-detect-offline';

function OfflineText() {
  return (
    <Offline>
      <div
        style={{
          textAlign: 'center',
          fontSize: '50px',
        }}
      >
        You are offline. Check your internet connection
      </div>
    </Offline>
  );
}

export default OfflineText;
