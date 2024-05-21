import React from 'react';
import './styles.css';

const ChronnosTitleInput = ({ title, icon}) => {
  return (
    <div className="title-input">
      <h1>{title}</h1>
      {icon}
    </div>
  );
};

export default ChronnosTitleInput;
