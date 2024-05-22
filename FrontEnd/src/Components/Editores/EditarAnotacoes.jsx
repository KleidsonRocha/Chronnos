import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';

const EditarCurso = () => {
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
        const formData = new FormData();
        formData.append('cursoId', curso.ID_CURSO);
        formData.append('anotacoes', curso.ANOTACOES);


        // fazer rota para editar anotações
        fetch(RotaBanco +'/curso/', {
            method: 'POST',
            body: formData,
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
                    <div >
                    {curso && curso.ARQUIVO && curso.ARQUIVO.endsWith('.pdf') ? (
                        <embed id="orgimg" src={RotaBanco + `/Images/${curso.ARQUIVO}`} type="application/pdf" width="100%" height="500px" />
                    ) : (
                        <img id="orgimg" src={RotaBanco + `/Images/${curso.ARQUIVO}`} width="100%" height="auto" />
                    )}
                </div>
                    <br />
                </form>
            )}
            <button id="editar-curso-btn" onClick={salvarAlteracoes}>Salvar Alterações</button>
        </>
    );
};

export default EditarCurso;
