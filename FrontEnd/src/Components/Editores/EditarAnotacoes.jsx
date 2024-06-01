import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';
import Dock from '../dock/Dock';

const EditarAnotacoes = () => {
    const { RotaBanco } = useGlobalContext();
    const [curso, setCurso] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const cursoId = urlParams.get('ID_CURSO');

        const url = RotaBanco + `/curso/listarCursoEspecifico?cursoId=${cursoId}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao obter os detalhes do curso');
                }
                return response.json();
            })
            .then(cursoData => {
                setCurso(cursoData);
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }, [RotaBanco]);

    function handleInputChange(event, field) {
        const value = event.target.value;
        setCurso(prevState => ({
            ...prevState,
            [field]: value
        }));
    }

    function salvarAlteracoes() {
        const dados = {
            cursoId: curso.ID_CURSO,
            anotacoes: curso.ANOTACOES,
        };

        fetch(RotaBanco + '/curso/editarAnotacoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <>
            {curso && (
                <form id="curso-formulario">
                    <label htmlFor="anotacoes">Anotações:</label>
                    <textarea id="anotacoes" name="anotacoes" value={curso.ANOTACOES} onChange={(e) => handleInputChange(e, 'ANOTACOES')}></textarea><br />
                    <br />
                </form>
            )}
            <button id="editar-curso-btn" onClick={salvarAlteracoes}>Salvar Alterações</button>
            <Dock/>
        </>
    );
};

export default EditarAnotacoes;
