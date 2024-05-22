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
                <input type="text" id="nome" name="nome" value={curso.NOME} onChange={(e) => handleInputChange(e, 'NOME')} /><br />
                <label htmlFor="modalidade">Modalidade:</label>
                <input type="text" id="modalidade" name="modalidade" value={curso.MODALIDADE} onChange={(e) => handleInputChange(e, 'MODALIDADE')} /><br />
                <label htmlFor="anotacoes">Anotações:</label>
                <textarea id="anotacoes" name="anotacoes" onChange={(e) => handleInputChange(e, 'ANOTACOES')}>{curso.ANOTACOES}</textarea><br />
                <label htmlFor="valor">Valor:</label>
                <input type="number" id="valor" name="valor" value={curso.VALOR} onChange={(e) => handleInputChange(e, 'VALOR')} /><br />
                <label htmlFor="area">Area:</label>
                <input type="text" id="area" value={curso.AREA} onChange={(e) => handleInputChange(e, 'AREA')} /><br />
                <label htmlFor="materia">Materia:</label>
                <input type="text" id="materia" value={curso.MATERIA} onChange={(e) => handleInputChange(e, 'MATERIA')} /><br />
                <label htmlFor="pagamento">Pagamento:</label>
                <input type="text" id="pagamento" value={curso.PAGAMENTO} onChange={(e) => handleInputChange(e, 'PAGAMENTO')} /><br />
                <label htmlFor="data_ini">Data de Início:</label>
                <input type="date" id="data_ini" name="data_ini" value={curso.DATA_INI} onChange={(e) => handleInputChange(e, 'DATA_INI')} /><br />
                <label htmlFor="data_fini">Data de Término:</label>
                <input type="date" id="data_fini" name="data_fini" value={curso.DATA_FINI} onChange={(e) => handleInputChange(e, 'DATA_FINI')} /><br />
                <label htmlFor="duracao">Duração:</label>
                <input type="text" id="duracao" name="duracao" value={curso.DURACAO} onChange={(e) => handleInputChange(e, 'DURACAO')} /><br />
                <label htmlFor="media">Média:</label>
                <input type="number" id="media" name="media" value={curso.MEDIA} onChange={(e) => handleInputChange(e, 'MEDIA')} /><br />
                <label htmlFor="imagem">Imagem:</label>
                <input type="file" id="imagem" name="imagem" onChange={handleImagemChange} /><br />
                <div >
                    {curso && curso.ARQUIVO && curso.ARQUIVO.endsWith('.pdf') ? (
                        <embed id="orgimg" src={RotaBanco + `/Images/${curso.ARQUIVO}`} type="application/pdf" width="100%" height="500px" />
                    ) : (
                        <img id="orgimg" src={RotaBanco + `/Images/${curso.ARQUIVO}`} width="100%" height="auto" />
                    )}
                </div>
            </form>
        );
    }
    

    function handleInputChange(event, field) {
        const value = event.target.value;
        setCurso(prevState => ({
            ...prevState,
            [field]: value
        }));
    }

    function handleImagemChange(event) {
        const imagemInput = event.target;
        const imagemFile = imagemInput.files[0];
        const orgimg = document.getElementById('orgimg');
    
        if (imagemFile) {
            if (imagemFile.type === 'application/pdf') {
                // Se for um PDF, cria um elemento embed
                const embedElement = document.createElement('embed');
                embedElement.src = URL.createObjectURL(imagemFile);
                embedElement.type = 'application/pdf';
                embedElement.width = '100%';
                embedElement.height = '500px';
                orgimg.innerHTML = ''; // Limpa o conteúdo existente
                orgimg.appendChild(embedElement); // Adiciona o elemento embed à div orgimg
            } else {
                // Se for uma imagem, cria um elemento img
                const imgElement = document.createElement('img');
                imgElement.src = URL.createObjectURL(imagemFile);
                imgElement.width = '100%';
                imgElement.height = 'auto'; // Ajusta a altura automaticamente
                orgimg.innerHTML = ''; // Limpa o conteúdo existente
                orgimg.appendChild(imgElement); // Adiciona o elemento img à div orgimg
            }
        } else {
            // Se nenhum arquivo foi selecionado, restaura a imagem original
            orgimg.innerHTML = `<embed src="${RotaBanco}/Images/${curso.ARQUIVO}" type="application/pdf" width="100%" height="500px" />`;
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

        const imagemInput = document.getElementById('imagem');
        const imagemFile = imagemInput.files[0];
        if (imagemFile == null && img == null) {
            formData.append('imagem', null);
        } else {
            formData.append('imagem', imagemFile);
        }



        fetch(RotaBanco +'/curso/editarCurso', {
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
        <div>
            {curso && preencherFormulario(curso)}
            <button id="editar-curso-btn" onClick={salvarAlteracoes}>Salvar Alterações</button>
        </div>

    );
};

export default EditarCurso;
