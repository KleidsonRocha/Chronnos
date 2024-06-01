import React, { useEffect } from 'react';
import './styles.css';
import ChronnosButton from '../inputs-buttons/ChronnosButton/ChronnosButton';
import confetti from 'canvas-confetti';

const ChronnosPopUp = ({ title, btntxt, btntype, cmd, conft = false }) => {
    useEffect(() => {
        if (conft) {
            confetti({
                particleCount: 69,
                spread: 50,
                origin: { y: 0.52 },
              });
        }
    }, [conft]);

    return (
        <div className="popup">
            <p className="txt-titulo">{title}</p>
            <ChronnosButton type={btntype} {...cmd} className={"button-default"}>{btntxt}</ChronnosButton>
        </div>
    );
};

export default ChronnosPopUp;