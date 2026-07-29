import React from 'react';

const Loader = ({ message = 'Loading data...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
};

export default Loader;
