import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles.css';
import HomeButton from '../inputs-buttons/home-button/HomeButton';

const Dock = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const getActiveButton = () => {
        switch (location.pathname) {
            case '/Home':
                return '1';
            case '/Anotacoes':
                return '2';
            case '/Timeline':
                return '3';
            case '/Ajustes':
                return '4'
            default:
                return '1';
        }
    };
    const [activeButton, setActiveButton] = useState(getActiveButton());

    const handleClick = (pagina, buttonId) => {
        setActiveButton(buttonId);
        navigate(pagina);
        if ("vibrate" in navigator) navigator.vibrate(30);
    };

    return (
        <>
            <HomeButton />
            <div className="dock">
                <button className="dock-button" onClick={() => handleClick('/Home', '1')}>
                    <div className="dock-icon">
                        <svg width={"2rem"} height={"2rem"}>
                            <path fill={activeButton === "1" ? "#000000" : "#808080"} d="M8.0666 23.7C7.62216 23.4556 7.27771 23.1278 7.03327 22.7167C6.78882 22.3056 6.6666 21.8445 6.6666 21.3334V14.9334L3.4666 13.1667C3.22216 13.0334 3.04438 12.8667 2.93327 12.6667C2.82216 12.4667 2.7666 12.2445 2.7666 12C2.7666 11.7556 2.82216 11.5334 2.93327 11.3334C3.04438 11.1334 3.22216 10.9667 3.4666 10.8334L14.7333 4.70003C14.9333 4.58892 15.1388 4.50559 15.3499 4.45003C15.561 4.39448 15.7777 4.3667 15.9999 4.3667C16.2222 4.3667 16.4388 4.39448 16.6499 4.45003C16.861 4.50559 17.0666 4.58892 17.2666 4.70003L29.9666 11.6334C30.1888 11.7445 30.361 11.9056 30.4833 12.1167C30.6055 12.3278 30.6666 12.5556 30.6666 12.8V21.3334C30.6666 21.7111 30.5388 22.0278 30.2833 22.2834C30.0277 22.5389 29.711 22.6667 29.3333 22.6667C28.9555 22.6667 28.6388 22.5389 28.3833 22.2834C28.1277 22.0278 27.9999 21.7111 27.9999 21.3334V13.4667L25.3333 14.9334V21.3334C25.3333 21.8445 25.211 22.3056 24.9666 22.7167C24.7222 23.1278 24.3777 23.4556 23.9333 23.7L17.2666 27.3C17.0666 27.4111 16.861 27.4945 16.6499 27.55C16.4388 27.6056 16.2222 27.6334 15.9999 27.6334C15.7777 27.6334 15.561 27.6056 15.3499 27.55C15.1388 27.4945 14.9333 27.4111 14.7333 27.3L8.0666 23.7ZM15.9999 16.9334L25.1333 12L15.9999 7.0667L6.8666 12L15.9999 16.9334ZM15.9999 24.9667L22.6666 21.3667V16.3334L17.2999 19.3C17.0999 19.4111 16.8888 19.4945 16.6666 19.55C16.4444 19.6056 16.2222 19.6334 15.9999 19.6334C15.7777 19.6334 15.5555 19.6056 15.3333 19.55C15.111 19.4945 14.8999 19.4111 14.6999 19.3L9.33327 16.3334V21.3667L15.9999 24.9667Z" />
                        </svg>
                    </div>
                    <p style={{ color: activeButton === "1" ? "#000000" : "#808080", fontWeight: activeButton === "1" ? 700 : 400 }}>Cursos</p>
                </button>
                <button className="dock-button" onClick={() => handleClick('/Anotacoes', '2')}>
                    <div className="dock-icon">
                        <svg width={"2rem"} height={"2rem"}>
                            <path fill={activeButton === "2" ? "#000000" : "#808080"} d="M9.333 26.667v-14.7q0-1.1.8-1.867a2.65 2.65 0 0 1 1.9-.767h14.634q1.099 0 1.883.784.783.783.783 1.883v10.667l-6.666 6.666H12a2.57 2.57 0 0 1-1.883-.783 2.57 2.57 0 0 1-.784-1.883M2.7 8.333q-.2-1.1.433-1.983.634-.883 1.734-1.083L19.333 2.7q1.1-.2 1.984.433.884.634 1.083 1.734l.333 1.8H20l-.233-1.334L5.333 7.9l1.334 7.533v9.3a3 3 0 0 1-.917-.8 2.46 2.46 0 0 1-.483-1.133zM12 12v14.667h9.333v-4q0-.567.384-.95a1.3 1.3 0 0 1 .95-.384h4V12z" />
                        </svg>
                    </div>
                    <p style={{ color: activeButton === "2" ? "#000000" : "#808080", fontWeight: activeButton === "2" ? 700 : 400 }}>Anotações</p>
                </button>
                <button className="dock-button" onClick={() => handleClick('/Timeline', '3')}>
                    <div className="dock-icon">
                        <svg width={"2rem"} height={"2rem"}>
                            <path fill={activeButton === "3" ? "#000000" : "#808080"} path d="M4.00004 24C3.26671 24 2.63893 23.7389 2.11671 23.2167C1.59449 22.6944 1.33337 22.0667 1.33337 21.3333C1.33337 20.6 1.59449 19.9722 2.11671 19.45C2.63893 18.9278 3.26671 18.6667 4.00004 18.6667H4.35004C4.45004 18.6667 4.5556 18.6889 4.66671 18.7333L10.7334 12.6667C10.6889 12.5556 10.6667 12.45 10.6667 12.35V12C10.6667 11.2667 10.9278 10.6389 11.45 10.1167C11.9723 9.59444 12.6 9.33333 13.3334 9.33333C14.0667 9.33333 14.6945 9.59444 15.2167 10.1167C15.7389 10.6389 16 11.2667 16 12C16 12.0444 15.9778 12.2667 15.9334 12.6667L19.3334 16.0667C19.4445 16.0222 19.55 16 19.65 16H20.35C20.45 16 20.5556 16.0222 20.6667 16.0667L25.4 11.3333C25.3556 11.2222 25.3334 11.1167 25.3334 11.0167V10.6667C25.3334 9.93333 25.5945 9.30556 26.1167 8.78333C26.6389 8.26111 27.2667 8 28 8C28.7334 8 29.3612 8.26111 29.8834 8.78333C30.4056 9.30556 30.6667 9.93333 30.6667 10.6667C30.6667 11.4 30.4056 12.0278 29.8834 12.55C29.3612 13.0722 28.7334 13.3333 28 13.3333H27.65C27.55 13.3333 27.4445 13.3111 27.3334 13.2667L22.6 18C22.6445 18.1111 22.6667 18.2167 22.6667 18.3167V18.6667C22.6667 19.4 22.4056 20.0278 21.8834 20.55C21.3612 21.0722 20.7334 21.3333 20 21.3333C19.2667 21.3333 18.6389 21.0722 18.1167 20.55C17.5945 20.0278 17.3334 19.4 17.3334 18.6667V18.3167C17.3334 18.2167 17.3556 18.1111 17.4 18L14 14.6C13.8889 14.6444 13.7834 14.6667 13.6834 14.6667H13.3334C13.2889 14.6667 13.0667 14.6444 12.6667 14.6L6.60004 20.6667C6.64449 20.7778 6.66671 20.8833 6.66671 20.9833V21.3333C6.66671 22.0667 6.4056 22.6944 5.88337 23.2167C5.36115 23.7389 4.73337 24 4.00004 24Z" />
                        </svg>
                    </div>
                    <p style={{ color: activeButton === "3" ? "#000000" : "#808080", fontWeight: activeButton === "3" ? 700 : 400 }}>Timeline</p>
                </button>
                <button className="dock-button" onClick={() => handleClick('/Ajustes', '4')}>
                    <div className="dock-icon">
                        <svg width={"2rem"} height={"2rem"} viewBox="0 0 26 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill={activeButton === "4" ? "#000000" : "#808080"} d="M11.4333 27.3333C10.8333 27.3333 10.3166 27.1333 9.88331 26.7333C9.44997 26.3333 9.18886 25.8444 9.09997 25.2666L8.79997 23.0666C8.51109 22.9555 8.23886 22.8222 7.98331 22.6666C7.72775 22.5111 7.47775 22.3444 7.23331 22.1666L5.16664 23.0333C4.61108 23.2777 4.05553 23.3 3.49997 23.1C2.94442 22.9 2.51108 22.5444 2.19997 22.0333L0.633307 19.3C0.322196 18.7888 0.233307 18.2444 0.366641 17.6666C0.499974 17.0888 0.799974 16.6111 1.26664 16.2333L3.03331 14.9C3.01109 14.7444 2.99997 14.5944 2.99997 14.45V13.55C2.99997 13.4055 3.01109 13.2555 3.03331 13.1L1.26664 11.7666C0.799974 11.3888 0.499974 10.9111 0.366641 10.3333C0.233307 9.75551 0.322196 9.21107 0.633307 8.69996L2.19997 5.96663C2.51108 5.45551 2.94442 5.09996 3.49997 4.89996C4.05553 4.69996 4.61108 4.72218 5.16664 4.96663L7.23331 5.83329C7.47775 5.65551 7.73331 5.48885 7.99997 5.33329C8.26664 5.17774 8.53331 5.0444 8.79997 4.93329L9.09997 2.73329C9.18886 2.15551 9.44997 1.66663 9.88331 1.26663C10.3166 0.866626 10.8333 0.666626 11.4333 0.666626H14.5666C15.1666 0.666626 15.6833 0.866626 16.1166 1.26663C16.55 1.66663 16.8111 2.15551 16.9 2.73329L17.2 4.93329C17.4889 5.0444 17.7611 5.17774 18.0166 5.33329C18.2722 5.48885 18.5222 5.65551 18.7666 5.83329L20.8333 4.96663C21.3889 4.72218 21.9444 4.69996 22.5 4.89996C23.0555 5.09996 23.4889 5.45551 23.8 5.96663L25.3666 8.69996C25.6777 9.21107 25.7666 9.75551 25.6333 10.3333C25.5 10.9111 25.2 11.3888 24.7333 11.7666L22.9666 13.1C22.9889 13.2555 23 13.4055 23 13.55V14.45C23 14.5944 22.9777 14.7444 22.9333 14.9L24.7 16.2333C25.1666 16.6111 25.4666 17.0888 25.6 17.6666C25.7333 18.2444 25.6444 18.7888 25.3333 19.3L23.7333 22.0333C23.4222 22.5444 22.9889 22.9 22.4333 23.1C21.8778 23.3 21.3222 23.2777 20.7666 23.0333L18.7666 22.1666C18.5222 22.3444 18.2666 22.5111 18 22.6666C17.7333 22.8222 17.4666 22.9555 17.2 23.0666L16.9 25.2666C16.8111 25.8444 16.55 26.3333 16.1166 26.7333C15.6833 27.1333 15.1666 27.3333 14.5666 27.3333H11.4333ZM11.6666 24.6666H14.3L14.7666 21.1333C15.4555 20.9555 16.0944 20.6944 16.6833 20.35C17.2722 20.0055 17.8111 19.5888 18.3 19.1L21.6 20.4666L22.9 18.2L20.0333 16.0333C20.1444 15.7222 20.2222 15.3944 20.2666 15.05C20.3111 14.7055 20.3333 14.3555 20.3333 14C20.3333 13.6444 20.3111 13.2944 20.2666 12.95C20.2222 12.6055 20.1444 12.2777 20.0333 11.9666L22.9 9.79996L21.6 7.53329L18.3 8.93329C17.8111 8.42218 17.2722 7.9944 16.6833 7.64996C16.0944 7.30551 15.4555 7.0444 14.7666 6.86663L14.3333 3.33329H11.7L11.2333 6.86663C10.5444 7.0444 9.90553 7.30551 9.31664 7.64996C8.72775 7.9944 8.18886 8.41107 7.69997 8.89996L4.39997 7.53329L3.09997 9.79996L5.96664 11.9333C5.85553 12.2666 5.77775 12.6 5.73331 12.9333C5.68886 13.2666 5.66664 13.6222 5.66664 14C5.66664 14.3555 5.68886 14.7 5.73331 15.0333C5.77775 15.3666 5.85553 15.7 5.96664 16.0333L3.09997 18.2L4.39997 20.4666L7.69997 19.0666C8.18886 19.5777 8.72775 20.0055 9.31664 20.35C9.90553 20.6944 10.5444 20.9555 11.2333 21.1333L11.6666 24.6666ZM13.0666 18.6666C14.3555 18.6666 15.4555 18.2111 16.3666 17.3C17.2778 16.3888 17.7333 15.2888 17.7333 14C17.7333 12.7111 17.2778 11.6111 16.3666 10.7C15.4555 9.78885 14.3555 9.33329 13.0666 9.33329C11.7555 9.33329 10.65 9.78885 9.74997 10.7C8.84997 11.6111 8.39997 12.7111 8.39997 14C8.39997 15.2888 8.84997 16.3888 9.74997 17.3C10.65 18.2111 11.7555 18.6666 13.0666 18.6666Z" />
                        </svg>
                    </div>
                    <p style={{ color: activeButton === "4" ? "#000000" : "#808080", fontWeight: activeButton === "4" ? 700 : 400 }}>Ajustes</p>
                </button>
            </div>
        </>
    );
};

export default Dock;
