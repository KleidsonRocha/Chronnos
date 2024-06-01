import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';
import MainMobile from '../layouts/MainMobile/MainMobile';
import ChronnosButton from '../inputs-buttons/ChronnosButton/ChronnosButton';
import ChronnosInput from '../inputs-buttons/ChronnosInput/ChronnosInput';
import ChronnosPopUp from '../ChronnosPopUp/ChronnosPopUp';
import "../../Assets/utility.css";
import "../../Components/Cadastro/CadastroCurso/styles.css"

const EditarCurso = () => {
    const { RotaBanco } = useGlobalContext();
    const [curso, setCurso] = useState(null);
    const [showPopup, setShowPopup] = useState(false); // Estado para controlar a exibição do pop-up
    const [showPopupEdicao, setShowPopupEdicao] = useState(false); // Estado para controlar a exibição do pop-up

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
                <div className="layout-vertical">
                    <div className="holder-dados">
                        <p>Nome do curso</p>
                        <ChronnosInput
                            type="text"
                            id="nome"
                            value={curso.NOME}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'NOME')}
                        />
                    </div>
                    <div className="holder-dados">
                        <p>Area</p>
                        <ChronnosInput
                            type="text"
                            id="area"
                            value={curso.AREA}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'AREA')}
                        />
                    </div>
                    <div className="holder-dados">
                        <p>Materia</p>
                        <ChronnosInput
                            type="text"
                            id="materia"
                            value={curso.MATERIA}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'MATERIA')}
                        />
                    </div>
                    <div className="holder-dados">
                        <p>Formato de pagamento</p>
                        <ChronnosInput
                            type="text"
                            id="pagamento"
                            value={curso.PAGAMENTO}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'PAGAMENTO')}
                        />
                    </div>
                    <div className="holder-dados">
                        <p>Valor</p>
                        <ChronnosInput
                            type="number"
                            id="valor"
                            value={curso.VALOR}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'VALOR')}
                        />
                    </div>
                    <div className="holder-dados">
                        <p>Modalidade</p>
                        <ChronnosInput
                            type="text"
                            id="modalidade"
                            value={curso.MODALIDADE}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'MODALIDADE')}
                        />
                    </div>
                    <div className="holder-dados">
                        <p>Média</p>
                        <ChronnosInput
                            type="number"
                            id="media"
                            value={curso.MEDIA}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'MEDIA')}
                        />
                    </div>
                    <div className="holder-dados">
                        <p>Anotações</p>
                        <textarea
                            id="anotacoes"
                            name="anotacoes"
                            value={curso.ANOTACOES}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'ANOTACOES')}
                        />
                    </div>
                    <div className="holder-pickers">
                        <div className="holder-pickers">
                            <p>Início do curso</p>
                            <ChronnosInput
                                type="date"
                                id="data_ini"
                                value={curso.DATA_INI}
                                className="picker-data"
                                onChange={(e) => handleInputChange(e, 'DATA_INI')}
                            />
                        </div>
                        <div className="holder-pickers">
                            <p>Fim do curso</p>
                            <ChronnosInput
                                type="date"
                                id="data_fini"
                                value={curso.DATA_FINI}
                                className="picker-data"
                                onChange={(e) => handleInputChange(e, 'DATA_FINI')}
                            />
                        </div>
                    </div>
                    <div className="holder-dados">
                        <p>Duração</p>
                        <ChronnosInput
                            type="text"
                            id="duracao"
                            value={curso.DURACAO}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'DURACAO')}
                        />
                    </div>
                    <input type="file" id="imagem" name="imagem" onChange={handleImagemChange} />
                    <div >
                        {curso && curso.ARQUIVO && curso.ARQUIVO.endsWith('.pdf') ? (
                            <embed id="orgimg" src={RotaBanco + `/Images/${curso.ARQUIVO}`} type="application/pdf" width="100%" height="500px" />
                        ) : (
                            <img id="orgimg" src={RotaBanco + `/Images/${curso.ARQUIVO}`} width="100%" height="auto" />
                        )}
                    </div>
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
        formData.append('cursoId', curso.ID_CURSO);
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



        fetch(RotaBanco + '/curso/editarCurso', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setShowPopupEdicao(true);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    function excluirCurso() {
        const urlParams = new URLSearchParams(window.location.search);
        const cursoId = urlParams.get('ID_CURSO');

        const url = RotaBanco + `/curso/excluirCurso?cursoId=${cursoId}`;
        console.log(url);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao excluir curso');
                }
                setShowPopup(true);
            })
    }
    const handleClosePopup = () => {
        setShowPopup(false);
        window.location.href = '/Home';
    };


    return (
        <>
            <MainMobile className="main-mob">
                <h1>Editar um curso</h1>
                <div>
                    {curso && preencherFormulario(curso)}
                </div>
                <ChronnosButton id="editar-curso-btn" onClick={salvarAlteracoes} className="button-default">Salvar as edições</ChronnosButton>
                <ChronnosButton id="editar-curso-btn" onClick={excluirCurso} className="button">Excluir</ChronnosButton>
            </MainMobile>
            {showPopup && (
                <ChronnosPopUp title="Curso excluido com sucesso!" btntxt="Retornar a Home" btntype="submit" cmd={{ onClick: handleClosePopup }}></ChronnosPopUp>
            )}
            {showPopupEdicao && (
                <ChronnosPopUp title="Curso editado com sucesso!" btntxt="Retornar a Home" btntype="submit" cmd={{ onClick: handleClosePopup }}></ChronnosPopUp>
            )}
        </>
    );
};

export default EditarCurso;
