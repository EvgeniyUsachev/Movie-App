import React, { useEffect } from 'react';

function ErrorIndicator() {
  useEffect(() => {
    console.log('error did mount');
    return () => {
      console.log('error did unmount');
    };
  });

  return (
    <>
      <h1>No films found for the given request</h1>
    </>
  );
}

export default ErrorIndicator;
