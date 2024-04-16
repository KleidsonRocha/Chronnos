import React from 'react';
import './styles.css';

const ChronnosButton = ({ onClick, className, children }) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default ChronnosButton;