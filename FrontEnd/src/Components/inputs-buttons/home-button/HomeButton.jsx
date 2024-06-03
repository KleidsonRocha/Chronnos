import React from 'react';
import './styles.css';
import homeButton from './chronnos-home-button.png';

const HomeButton = ({}) => {
  return (
    <div className="home-button-holder">
        <a href="/Home"><img src={homeButton} className="home-button"/></a>
    </div>
  );
};

export default HomeButton;