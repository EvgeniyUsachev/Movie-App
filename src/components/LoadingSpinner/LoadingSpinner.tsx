import React from 'react';
import { Spin } from 'antd';
import './LoadingSpinner.scss';

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <span>Loading films</span>
      <br></br>
      <span>Wait a second, please</span>
      <br></br>
      <div className="spinner">
        <Spin size="large"></Spin>
      </div>
    </div>
  );
}

export default LoadingSpinner;
