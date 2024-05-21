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

    function preencherFormulario(curso) {
        return (
            <form id="curso-formulario">
                <input type="hidden" id="cursoId" name="cursoId" value={curso.ID_CURSO} />
                <label htmlFor="nome">Nome:</label>
                <input type="text" id="nome" name="nome" value={curso.NOME} /><br />
                <label htmlFor="modalidade">Modalidade:</label>
                <input type="text" id="modalidade" name="modalidade" value={curso.MODALIDADE} /><br />
                <label htmlFor="anotacoes">Anotações:</label>
                <textarea id="anotacoes" name="anotacoes">{curso.ANOTACOES}</textarea><br />
                <label htmlFor="valor">Valor:</label>
                <input type="number" id="valor" name="valor" value={curso.VALOR} /><br />
                <label htmlFor="area">Area:</label>
                <input type="text" id="area" value={curso.AREA} /><br />
                <label htmlFor="materia">Materia:</label>
                <input type="text" id="materia" value={curso.MATERIA} /><br />
                <label htmlFor="pagamento">Pagamento:</label>
                <input type="text" id="pagamento" value={curso.PAGAMENTO} /><br />
                <label htmlFor="data_ini">Data de Início:</label>
                <input type="date" id="data_ini" name="data_ini" value={curso.DATA_INI} /><br />
                <label htmlFor="data_fini">Data de Término:</label>
                <input type="date" id="data_fini" name="data_fini" value={curso.DATA_FINI} /><br />
                <label htmlFor="duracao">Duração:</label>
                <input type="text" id="duracao" name="duracao" value={curso.DURACAO} /><br />
                <label htmlFor="media">Média:</label>
                <input type="number" id="media" name="media" value={curso.MEDIA} /><br />
                <label htmlFor="imagem">Imagem:</label>
                <div>
                    {curso.ARQUIVO && curso.ARQUIVO.endsWith('.pdf') ? (
                        <embed id="orgimg" src={`./Backend/Images/${curso.ARQUIVO}`} type="application/pdf" />
                    ) : (
                        <img id="orgimg" src={`./Backend/Images/${curso.ARQUIVO}`} alt="Imagem do curso" />
                    )}
                </div>
                <input type="file" id="imagem" name="imagem" onChange={handleImagemChange} /><br />
            </form>
        );
    }

    function handleImagemChange(event) {
        const imagemInput = event.target;
        const imagemFile = imagemInput.files[0];
        const orgimg = document.getElementById('orgimg');

        if (imagemFile) {
            // Se uma nova imagem foi selecionada, exibe-a
            orgimg.src = URL.createObjectURL(imagemFile);
        } else {
            // Se nenhum arquivo foi selecionado, restaura a imagem original
            orgimg.src = `./Backend/Images/${curso.ARQUIVO}`;
        }
    }

    function salvarAlteracoes() {
        // Criação do formulário para passar como body da requisição do fetch 
        const formData = new FormData();
        formData.append('cursoId', document.getElementById('cursoId').value);
        formData.append('nome', document.getElementById('nome').value);
        formData.append('modalidade', document.getElementById('modalidade').value);
        formData.append('anotacoes', document.getElementById('anotacoes').value);
        formData.append('valor', document.getElementById('valor').value);
        formData.append('area', document.getElementById('area').value);
        formData.append('pagamento', document.getElementById('pagamento').value);
        formData.append('materia', document.getElementById('materia').value);
        formData.append('dataIni', document.getElementById('data_ini').value);
        formData.append('dataFini', document.getElementById('data_fini').value);
        formData.append('duracao', document.getElementById('duracao').value);
        formData.append('media', document.getElementById('media').value);
        
        const orgimg = document.getElementById('orgimg').src;
        const parts = orgimg.split('/');
        const img = parts[parts.length - 1];
        formData.append('imagem', img)
        console.log(img);
      
        const imagemInput = document.getElementById('imagem');
        const imagemFile = imagemInput.files[0];
        if(imagemFile == null && img == null) {
            formData.append('imagem', null);
        } else {
            formData.append('imagem', imagemFile);
        }
      
        fetch('http://localhost:3000/curso/editarCurso', {
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
            {curso && preencherFormulario(curso)}
            <button id="editar-curso-btn" onClick={salvarAlteracoes}>Salvar Alterações</button>
        </>
    );
};

export default EditarCurso;
