import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';
import MainMobile from '../layouts/MainMobile/MainMobile';
import ChronnosInput from '../inputs-buttons/ChronnosInput/ChronnosInput';
import ChronnosButton from '../inputs-buttons/ChronnosButton/ChronnosButton';
import Dock from '../dock/Dock';
import { useHref } from 'react-router-dom';

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
            <MainMobile className="form-mob-cent">
                {curso && (
                    <form id="curso-formulario">
                        <div className="layout-vertical">
                            <h1>Editar uma anotação</h1>
                            <ChronnosInput type="text" className="input-default" placeholder="Link do Curso" value={curso.ANOTACOES} onChange={(e) => handleInputChange(e, 'ANOTACOES')}></ChronnosInput>
                            <ChronnosButton id="editar-curso-btn" className="button-default" onClick={salvarAlteracoes}>Salvar alterações</ChronnosButton>
                        </div>
                    </form>
                )}
            </MainMobile>
            <Dock />
        </>
    );
};

export default EditarAnotacoes;
