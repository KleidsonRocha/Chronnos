import React from 'react';
import './styles.css';
import ChronnosButton from '../inputs-buttons/ChronnosButton/ChronnosButton';

const ChronnosPopUp = ({ title, btntxt, btntype, cmd }) => {
    return (
        <div className="popup">
            <p className="txt-titulo">{title}</p>
            <ChronnosButton type={btntype} {...cmd} className={"button-default"}>{btntxt}</ChronnosButton>
        </div>
    );
};

export default ChronnosPopUp;