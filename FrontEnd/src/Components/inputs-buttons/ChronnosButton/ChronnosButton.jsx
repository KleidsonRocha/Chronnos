import React from 'react';
import './styles.css';

const ChronnosButton = ({ onClick, className, children }) => {
  const feedbackHapticoButton = () => {
    if ("vibrate" in navigator) navigator.vibrate(30);
  }

  const handleClick = () => {
    if (onClick) onClick();
    feedbackHapticoButton();
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

export default ChronnosButton;
