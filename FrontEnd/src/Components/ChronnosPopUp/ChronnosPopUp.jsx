import React, { useEffect } from 'react';
import './styles.css';
import ChronnosButton from '../inputs-buttons/ChronnosButton/ChronnosButton';
import confetti from 'canvas-confetti';

const ChronnosPopUp = ({ title, btntxt, btntype, cmd, close, conft = false }) => {
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
            <button onClick={close} className="close-popup-btn">
                <svg width="2rem" height="2rem" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.0001 17.8667L9.46673 24.4001C9.22229 24.6445 8.91118 24.7667 8.5334 24.7667C8.15562 24.7667 7.84451 24.6445 7.60007 24.4001C7.35562 24.1556 7.2334 23.8445 7.2334 23.4667C7.2334 23.089 7.35562 22.7778 7.60007 22.5334L14.1334 16.0001L7.60007 9.46673C7.35562 9.22229 7.2334 8.91118 7.2334 8.5334C7.2334 8.15562 7.35562 7.84451 7.60007 7.60007C7.84451 7.35562 8.15562 7.2334 8.5334 7.2334C8.91118 7.2334 9.22229 7.35562 9.46673 7.60007L16.0001 14.1334L22.5334 7.60007C22.7778 7.35562 23.089 7.2334 23.4667 7.2334C23.8445 7.2334 24.1556 7.35562 24.4001 7.60007C24.6445 7.84451 24.7667 8.15562 24.7667 8.5334C24.7667 8.91118 24.6445 9.22229 24.4001 9.46673L17.8667 16.0001L24.4001 22.5334C24.6445 22.7778 24.7667 23.089 24.7667 23.4667C24.7667 23.8445 24.6445 24.1556 24.4001 24.4001C24.1556 24.6445 23.8445 24.7667 23.4667 24.7667C23.089 24.7667 22.7778 24.6445 22.5334 24.4001L16.0001 17.8667Z" fill="#000000" />
                </svg>
            </button>
            <p className="txt-titulo">{title}</p>
            <ChronnosButton type={btntype} {...cmd} className={"button-default"}>{btntxt}</ChronnosButton>
        </div>
    );
};

export default ChronnosPopUp;