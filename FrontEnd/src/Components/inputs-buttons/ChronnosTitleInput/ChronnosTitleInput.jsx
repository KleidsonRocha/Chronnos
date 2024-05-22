import React from 'react';
import './styles.css';

const getIcon = (iconName) => {
  switch (iconName) {
    case 'add':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.66666 11.3333H1.99999C1.62221 11.3333 1.30555 11.2055 1.04999 10.95C0.794434 10.6944 0.666656 10.3777 0.666656 9.99996C0.666656 9.62218 0.794434 9.30551 1.04999 9.04996C1.30555 8.7944 1.62221 8.66663 1.99999 8.66663H8.66666V1.99996C8.66666 1.62218 8.79443 1.30551 9.04999 1.04996C9.30554 0.794404 9.62221 0.666626 9.99999 0.666626C10.3778 0.666626 10.6944 0.794404 10.95 1.04996C11.2055 1.30551 11.3333 1.62218 11.3333 1.99996V8.66663H18C18.3778 8.66663 18.6944 8.7944 18.95 9.04996C19.2055 9.30551 19.3333 9.62218 19.3333 9.99996C19.3333 10.3777 19.2055 10.6944 18.95 10.95C18.6944 11.2055 18.3778 11.3333 18 11.3333H11.3333V18C11.3333 18.3777 11.2055 18.6944 10.95 18.95C10.6944 19.2055 10.3778 19.3333 9.99999 19.3333C9.62221 19.3333 9.30554 19.2055 9.04999 18.95C8.79443 18.6944 8.66666 18.3777 8.66666 18V11.3333Z" fill="black" />
        </svg>
      );
    case 'comp':
      return (
        <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 27.3333C18.8889 27.3333 17.9444 26.9444 17.1667 26.1666C16.3889 25.3888 16 24.4444 16 23.3333C16 23.1777 16.0111 23.0166 16.0333 22.85C16.0556 22.6833 16.0889 22.5333 16.1333 22.4L6.73333 16.9333C6.35556 17.2666 5.93333 17.5277 5.46667 17.7166C5 17.9055 4.51111 18 4 18C2.88889 18 1.94444 17.6111 1.16667 16.8333C0.388889 16.0555 0 15.1111 0 14C0 12.8888 0.388889 11.9444 1.16667 11.1666C1.94444 10.3888 2.88889 9.99996 4 9.99996C4.51111 9.99996 5 10.0944 5.46667 10.2833C5.93333 10.4722 6.35556 10.7333 6.73333 11.0666L16.1333 5.59996C16.0889 5.46663 16.0556 5.31663 16.0333 5.14996C16.0111 4.98329 16 4.82218 16 4.66663C16 3.55551 16.3889 2.61107 17.1667 1.83329C17.9444 1.05551 18.8889 0.666626 20 0.666626C21.1111 0.666626 22.0556 1.05551 22.8333 1.83329C23.6111 2.61107 24 3.55551 24 4.66663C24 5.77774 23.6111 6.72218 22.8333 7.49996C22.0556 8.27774 21.1111 8.66663 20 8.66663C19.4889 8.66663 19 8.57218 18.5333 8.38329C18.0667 8.1944 17.6444 7.93329 17.2667 7.59996L7.86667 13.0666C7.91111 13.2 7.94444 13.35 7.96667 13.5166C7.98889 13.6833 8 13.8444 8 14C8 14.1555 7.98889 14.3166 7.96667 14.4833C7.94444 14.65 7.91111 14.8 7.86667 14.9333L17.2667 20.4C17.6444 20.0666 18.0667 19.8055 18.5333 19.6166C19 19.4277 19.4889 19.3333 20 19.3333C21.1111 19.3333 22.0556 19.7222 22.8333 20.5C23.6111 21.2777 24 22.2222 24 23.3333C24 24.4444 23.6111 25.3888 22.8333 26.1666C22.0556 26.9444 21.1111 27.3333 20 27.3333ZM20 5.99996C20.3778 5.99996 20.6944 5.87218 20.95 5.61663C21.2056 5.36107 21.3333 5.0444 21.3333 4.66663C21.3333 4.28885 21.2056 3.97218 20.95 3.71663C20.6944 3.46107 20.3778 3.33329 20 3.33329C19.6222 3.33329 19.3056 3.46107 19.05 3.71663C18.7944 3.97218 18.6667 4.28885 18.6667 4.66663C18.6667 5.0444 18.7944 5.36107 19.05 5.61663C19.3056 5.87218 19.6222 5.99996 20 5.99996ZM4 15.3333C4.37778 15.3333 4.69444 15.2055 4.95 14.95C5.20556 14.6944 5.33333 14.3777 5.33333 14C5.33333 13.6222 5.20556 13.3055 4.95 13.05C4.69444 12.7944 4.37778 12.6666 4 12.6666C3.62222 12.6666 3.30556 12.7944 3.05 13.05C2.79444 13.3055 2.66667 13.6222 2.66667 14C2.66667 14.3777 2.79444 14.6944 3.05 14.95C3.30556 15.2055 3.62222 15.3333 4 15.3333ZM20 24.6666C20.3778 24.6666 20.6944 24.5388 20.95 24.2833C21.2056 24.0277 21.3333 23.7111 21.3333 23.3333C21.3333 22.9555 21.2056 22.6388 20.95 22.3833C20.6944 22.1277 20.3778 22 20 22C19.6222 22 19.3056 22.1277 19.05 22.3833C18.7944 22.6388 18.6667 22.9555 18.6667 23.3333C18.6667 23.7111 18.7944 24.0277 19.05 24.2833C19.3056 24.5388 19.6222 24.6666 20 24.6666Z" fill="black" />
        </svg>
      );
    case 'note':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.33331 24.6666V9.96664C7.33331 9.23331 7.59998 8.61109 8.13331 8.09998C8.66664 7.58887 9.29998 7.33331 10.0333 7.33331H24.6666C25.4 7.33331 26.0278 7.59442 26.55 8.11664C27.0722 8.63887 27.3333 9.26664 27.3333 9.99998V19.5666C27.3333 19.9222 27.2666 20.2611 27.1333 20.5833C27 20.9055 26.8111 21.1889 26.5666 21.4333L21.4333 26.5666C21.1889 26.8111 20.9055 27 20.5833 27.1333C20.2611 27.2666 19.9222 27.3333 19.5666 27.3333H9.99998C9.26664 27.3333 8.63887 27.0722 8.11664 26.55C7.59442 26.0278 7.33331 25.4 7.33331 24.6666ZM0.699978 6.33331C0.566644 5.59998 0.711089 4.93887 1.13331 4.34998C1.55553 3.76109 2.13331 3.39998 2.86664 3.26664L17.3333 0.699978C18.0666 0.566644 18.7278 0.711089 19.3166 1.13331C19.9055 1.55553 20.2666 2.13331 20.4 2.86664L20.7333 4.66664H18L17.7666 3.33331L3.33331 5.89998L4.66664 13.4333V22.7333C4.31109 22.5333 4.00553 22.2666 3.74998 21.9333C3.49442 21.6 3.33331 21.2222 3.26664 20.8L0.699978 6.33331ZM9.99998 9.99998V24.6666H19.3333L24.6666 19.3333V9.99998H9.99998ZM16 18.6666V21.3333C16 21.7111 16.1278 22.0278 16.3833 22.2833C16.6389 22.5389 16.9555 22.6666 17.3333 22.6666C17.7111 22.6666 18.0278 22.5389 18.2833 22.2833C18.5389 22.0278 18.6666 21.7111 18.6666 21.3333V18.6666H21.3333C21.7111 18.6666 22.0278 18.5389 22.2833 18.2833C22.5389 18.0278 22.6666 17.7111 22.6666 17.3333C22.6666 16.9555 22.5389 16.6389 22.2833 16.3833C22.0278 16.1278 21.7111 16 21.3333 16H18.6666V13.3333C18.6666 12.9555 18.5389 12.6389 18.2833 12.3833C18.0278 12.1278 17.7111 12 17.3333 12C16.9555 12 16.6389 12.1278 16.3833 12.3833C16.1278 12.6389 16 12.9555 16 13.3333V16H13.3333C12.9555 16 12.6389 16.1278 12.3833 16.3833C12.1278 16.6389 12 16.9555 12 17.3333C12 17.7111 12.1278 18.0278 12.3833 18.2833C12.6389 18.5389 12.9555 18.6666 13.3333 18.6666H16Z" fill="black" />
        </svg>
      );
    case 'arrow':
      return (
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5333 9.33343H1.66668C1.2889 9.33343 0.972232 9.20565 0.716677 8.9501C0.461121 8.69454 0.333344 8.37788 0.333344 8.0001C0.333344 7.62232 0.461121 7.30565 0.716677 7.0501C0.972232 6.79454 1.2889 6.66676 1.66668 6.66676H16.5333L12.7333 2.86676C12.4667 2.6001 12.3389 2.28899 12.35 1.93343C12.3611 1.57787 12.4889 1.26676 12.7333 1.0001C13 0.73343 13.3167 0.594541 13.6833 0.58343C14.05 0.572319 14.3667 0.700097 14.6333 0.966764L20.7333 7.06676C20.8667 7.2001 20.9611 7.34454 21.0167 7.5001C21.0722 7.65565 21.1 7.82232 21.1 8.0001C21.1 8.17788 21.0722 8.34454 21.0167 8.5001C20.9611 8.65565 20.8667 8.8001 20.7333 8.93343L14.6333 15.0334C14.3667 15.3001 14.05 15.4279 13.6833 15.4168C13.3167 15.4057 13 15.2668 12.7333 15.0001C12.4889 14.7334 12.3611 14.4223 12.35 14.0668C12.3389 13.7112 12.4667 13.4001 12.7333 13.1334L16.5333 9.33343Z" fill="black" />
        </svg>
      );
    case 'arrow-red':
      return (
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5333 9.33343H1.66668C1.2889 9.33343 0.972232 9.20565 0.716677 8.9501C0.461121 8.69454 0.333344 8.37788 0.333344 8.0001C0.333344 7.62232 0.461121 7.30565 0.716677 7.0501C0.972232 6.79454 1.2889 6.66676 1.66668 6.66676H16.5333L12.7333 2.86676C12.4667 2.6001 12.3389 2.28899 12.35 1.93343C12.3611 1.57787 12.4889 1.26676 12.7333 1.0001C13 0.73343 13.3167 0.594541 13.6833 0.58343C14.05 0.572319 14.3667 0.700097 14.6333 0.966764L20.7333 7.06676C20.8667 7.2001 20.9611 7.34454 21.0167 7.5001C21.0722 7.65565 21.1 7.82232 21.1 8.0001C21.1 8.17788 21.0722 8.34454 21.0167 8.5001C20.9611 8.65565 20.8667 8.8001 20.7333 8.93343L14.6333 15.0334C14.3667 15.3001 14.05 15.4279 13.6833 15.4168C13.3167 15.4057 13 15.2668 12.7333 15.0001C12.4889 14.7334 12.3611 14.4223 12.35 14.0668C12.3389 13.7112 12.4667 13.4001 12.7333 13.1334L16.5333 9.33343Z" fill="#FF0000" />
        </svg>
      );
    case 'rem-curso':
      return (
        <svg width="26" height="28" viewBox="0 0 26 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.3333 23.9L19.4333 25.7666C19.1889 26.0111 18.8833 26.1388 18.5167 26.15C18.15 26.1611 17.8333 26.0333 17.5667 25.7666C17.3222 25.5222 17.2 25.2111 17.2 24.8333C17.2 24.4555 17.3222 24.1444 17.5667 23.9L19.4333 22L17.5667 20.1C17.3222 19.8555 17.1944 19.55 17.1833 19.1833C17.1722 18.8166 17.3 18.5 17.5667 18.2333C17.8111 17.9888 18.1222 17.8666 18.5 17.8666C18.8778 17.8666 19.1889 17.9888 19.4333 18.2333L21.3333 20.1L23.2333 18.2333C23.4778 17.9888 23.7833 17.8611 24.15 17.85C24.5167 17.8388 24.8333 17.9666 25.1 18.2333C25.3444 18.4777 25.4667 18.7888 25.4667 19.1666C25.4667 19.5444 25.3444 19.8555 25.1 20.1L23.2333 22L25.1 23.9C25.3444 24.1444 25.4722 24.45 25.4833 24.8166C25.4944 25.1833 25.3667 25.5 25.1 25.7666C24.8556 26.0111 24.5444 26.1333 24.1667 26.1333C23.7889 26.1333 23.4778 26.0111 23.2333 25.7666L21.3333 23.9ZM4 27.3333C2.88889 27.3333 1.94444 26.9444 1.16667 26.1666C0.388889 25.3888 0 24.4444 0 23.3333V22C0 21.2666 0.261111 20.6388 0.783333 20.1166C1.30556 19.5944 1.93333 19.3333 2.66667 19.3333H4V3.33329C4 2.59996 4.26111 1.97218 4.78333 1.44996C5.30556 0.927737 5.93333 0.666626 6.66667 0.666626H21.3333C22.0667 0.666626 22.6944 0.927737 23.2167 1.44996C23.7389 1.97218 24 2.59996 24 3.33329V14C24 14.3777 23.8722 14.6944 23.6167 14.95C23.3611 15.2055 23.0444 15.3333 22.6667 15.3333C22.2889 15.3333 21.9722 15.2055 21.7167 14.95C21.4611 14.6944 21.3333 14.3777 21.3333 14V3.33329H6.66667V19.3333H13.3333C13.7111 19.3333 14.0278 19.4611 14.2833 19.7166C14.5389 19.9722 14.6667 20.2888 14.6667 20.6666C14.6667 21.0444 14.5389 21.3611 14.2833 21.6166C14.0278 21.8722 13.7111 22 13.3333 22H2.66667V23.3333C2.66667 23.7111 2.79444 24.0277 3.05 24.2833C3.30556 24.5388 3.62222 24.6666 4 24.6666H13.3333C13.7111 24.6666 14.0278 24.7944 14.2833 25.05C14.5389 25.3055 14.6667 25.6222 14.6667 26C14.6667 26.3777 14.5389 26.6944 14.2833 26.95C14.0278 27.2055 13.7111 27.3333 13.3333 27.3333H4ZM9.33333 9.99996C8.95556 9.99996 8.63889 9.87218 8.38333 9.61663C8.12778 9.36107 8 9.0444 8 8.66663C8 8.28885 8.12778 7.97218 8.38333 7.71663C8.63889 7.46107 8.95556 7.33329 9.33333 7.33329H18.6667C19.0444 7.33329 19.3611 7.46107 19.6167 7.71663C19.8722 7.97218 20 8.28885 20 8.66663C20 9.0444 19.8722 9.36107 19.6167 9.61663C19.3611 9.87218 19.0444 9.99996 18.6667 9.99996H9.33333ZM9.33333 14C8.95556 14 8.63889 13.8722 8.38333 13.6166C8.12778 13.3611 8 13.0444 8 12.6666C8 12.2888 8.12778 11.9722 8.38333 11.7166C8.63889 11.4611 8.95556 11.3333 9.33333 11.3333H18.6667C19.0444 11.3333 19.3611 11.4611 19.6167 11.7166C19.8722 11.9722 20 12.2888 20 12.6666C20 13.0444 19.8722 13.3611 19.6167 13.6166C19.3611 13.8722 19.0444 14 18.6667 14H9.33333Z" fill="#FF0000" />
        </svg>
      );
    default:
      return null;
  }
};

const ChronnosTitleInput = ({ title, icon, format, type, cmd }) => {
  return (
    <div className="title-input">
      <h1 className={format}>{title}</h1>
      {type === 'a' ? (
        <a {...cmd}>{getIcon(icon)}</a>
      ) : type === 'button' ? (
        <button {...cmd}>{getIcon(icon)}</button>
      ) : null}
    </div>
  );
};

export default ChronnosTitleInput;