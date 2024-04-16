import React from 'react';
import './styles.css';

const ChronnosInput = ({ type, id, placeholder, value, className, onChange }) => {
  return (
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
};

export default ChronnosInput;
