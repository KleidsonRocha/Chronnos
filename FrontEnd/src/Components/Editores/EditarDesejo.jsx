import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';
import MainMobile from '../layouts/MainMobile/MainMobile';
import ChronnosButton from '../inputs-buttons/ChronnosButton/ChronnosButton';
import ChronnosInput from '../inputs-buttons/ChronnosInput/ChronnosInput';
import ChronnosPopUp from '../ChronnosPopUp/ChronnosPopUp';
import "../../Assets/utility.css";
import "../../Components/Cadastro/CadastroCurso/styles.css"

const EditarDesejo = () => {
    const { RotaBanco } = useGlobalContext();
    const [desejoCompleto, setDesejoCompleto] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupEdicao, setShowPopupEdicao] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const desejoid = urlParams.get('ID_DESEJO');

        const url = RotaBanco + `/desejo/listarDesejoEspecifico?desejoId=${desejoid}`;

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

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao obter os detalhes do desejo');
                }
                return response.json();
            })
            .then(desejoData => {
                const desejo = desejoData;
                const tratamentoErro = error => ({ error });

                const areaPromise = fetch(RotaBanco + `/curso/listarAreaEspecifica?areaId=${desejo.DESEJO_ID_AREA}`)
                    .then(response => response.ok ? response.json() : tratamentoErro('Erro ao obter os detalhes da área'))
                    .catch(error => tratamentoErro('Erro ao obter detalhes da área'));

                const materiaPromise = fetch(RotaBanco + `/curso/listarMateriaEspecifica?materiaId=${desejo.DESEJO_ID_MATERIA}`)
                    .then(response => response.ok ? response.json() : tratamentoErro('Erro ao obter os detalhes da matéria'))
                    .catch(error => tratamentoErro('Erro ao obter detalhes da matéria'));

                Promise.all([areaPromise, materiaPromise])
                    .then(results => {
                        const [areaResult, materiaResult] = results;
                        const desejoCompleto = {
                            ...desejo,
                            AREA_NOME: areaResult ? areaResult.NOME_AREA : 'Erro ao obter detalhes da área',
                            AREA_COR: areaResult ? areaResult.COR : 'Erro ao obter cor',
                            MATERIA_NOME: materiaResult ? materiaResult.NOME_MATERIA : 'Erro ao obter detalhes da matéria',
                        };
                        setDesejoCompleto(desejoCompleto);
                    })
                    .catch(error => {
                        console.error('Erro:', error);
                    });
            });
        setUserData(getUsuarioIdFromCookie());
    }, [RotaBanco]);


    function preencherFormulario(desejo) {
        return (
            <form id="curso-formulario">
                <div className="layout-vertical">
                <div className="holder-dados">
                        <p>NOME</p>
                        <ChronnosInput
                            type="text"
                            id="nome"
                            value={desejo.NOME}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'NOME')}
                        />
                    </div>
                    <div className="holder-dados">
                        <p>DESEJO_ID_AREA</p>
                        <ChronnosInput
                            type="text"
                            id="desejo_id_area"
                            value={desejo.DESEJO_ID_AREA}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'DESEJO_ID_AREA')}
                        />
                    </div>
                    <div className="holder-dados">
                        <p>DESEJO_ID_MATERIA</p>
                        <ChronnosInput
                            type="text"
                            id="desejo_id_materia"
                            value={desejo.DESEJO_ID_MATERIA}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'DESEJO_ID_MATERIA')}
                        />
                    </div>

                    <div className="holder-dados">
                        <p>LINK</p>
                        <ChronnosInput
                            type="text"
                            id="link"
                            value={desejo.LINK}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'LINK')}
                        />
                    </div>
                    <div className="holder-dados">
                        <p>MODALIDADE</p>
                        <ChronnosInput
                            type="text"
                            id="modalidade"
                            value={desejo.MODALIDADE}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'MODALIDADE')}
                        />
                    </div>
                </div>
            </form>
        );
    }

    function handleInputChange(event, field) {
        const value = event.target.value;
        setDesejoCompleto(prevState => ({
            ...prevState,
            [field]: value
        }));
    }

    const salvarAlteracoes = async event => {
        // Criação do formulário para passar como body da requisição do fetch 
        const formData = new FormData();
        formData.append('id_desejo', desejoCompleto.ID_DESEJO);
        formData.append('id_usuario', userData.ID_USUARIO);
        formData.append('nome', desejoCompleto.NOME);
        formData.append('modalidade', desejoCompleto.MODALIDADE);
        formData.append('id_area', desejoCompleto.DESEJO_ID_AREA);
        formData.append('id_materia', desejoCompleto.DESEJO_ID_MATERIA);
        formData.append('link', desejoCompleto.LINK);

        console.log(desejoCompleto);


        const response = await fetch(RotaBanco + '/desejo/editarDesejo', {
            method: 'POST',
            body: formData,
        })
        if (response.status == 200) {
            setShowPopupEdicao(true);
        }
    }

    function excluirDesejo() {
        const urlParams = new URLSearchParams(window.location.search);
        const cursoId = urlParams.get('ID_DESEJO');

        const url = RotaBanco + `/desejo/excluirDesejo?desejoId=${cursoId}`;

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
        setShowPopupEdicao(false)
        window.location.href = '/Home';
    };


    return (
        <>
            <MainMobile className="main-mob">
                <h1>Editar um desejo</h1>
                <div>
                    {desejoCompleto && preencherFormulario(desejoCompleto)}
                </div>
                <ChronnosButton id="editar-curso-btn" onClick={salvarAlteracoes} className="button-default">Salvar as edições</ChronnosButton>
                <ChronnosButton id="editar-curso-btn" onClick={excluirDesejo} className="button">Excluir</ChronnosButton>
            </MainMobile>
            {showPopup && (
                <ChronnosPopUp title="Desejo excluido com sucesso!" btntxt="Retornar a Home" btntype="submit" cmd={{ onClick: handleClosePopup }}></ChronnosPopUp>
            )}
            {showPopupEdicao && (
                <ChronnosPopUp title="Desejo editado com sucesso!" btntxt="Retornar a Home" btntype="submit" cmd={{ onClick: handleClosePopup }}></ChronnosPopUp>
            )}
        </>
    );
};

export default EditarDesejo;
