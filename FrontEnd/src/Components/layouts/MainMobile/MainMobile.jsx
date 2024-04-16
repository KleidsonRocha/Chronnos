import React from 'react';
import './styles.css';

const MainMobile = ({className, children }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default MainMobile;