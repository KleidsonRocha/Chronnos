import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';

const EditarAnotacoes = () => {
    const { RotaBanco } = useGlobalContext();


    useEffect(() => {
        const getUsuarioIdFromCookie = () => {
          const cookieString = document.cookie;
          const cookies = cookieString.split(';');
        
          for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split('=');
            const trimmedName = cookieName.trim();
            if (trimmedName === 'usuario') {
              const usuarioString = cookieValue.replace(/[()]/g, '');
              const usuarioObjeto = JSON.parse(usuarioString);
              return usuarioObjeto;
            }
          }
          return null;
        };
    
        // Chamada da função para obter dados do cookie
        const usuario = getUsuarioIdFromCookie();
        // Definindo os dados do usuário no estado userData
        setUserData(usuario);
      }, []);

    


    return (
        <>
          
        </>
    );
};

export default EditarAnotacoes;
