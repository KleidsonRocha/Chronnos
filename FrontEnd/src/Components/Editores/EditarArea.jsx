import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';
import MainMobile from '../layouts/MainMobile/MainMobile';
import ChronnosButton from '../inputs-buttons/ChronnosButton/ChronnosButton';
import ChronnosInput from '../inputs-buttons/ChronnosInput/ChronnosInput';
import ChronnosPopUp from '../ChronnosPopUp/ChronnosPopUp';
import "../../Assets/utility.css";
import "../../Components/Cadastro/CadastroCurso/styles.css"
import Dock from '../dock/Dock';
import ChronnosTitleInput from '../inputs-buttons/ChronnosTitleInput/ChronnosTitleInput';

const EditarArea = () => {
    const { RotaBanco } = useGlobalContext();
    const [cor, setCor] = useState('');
    const [area, setArea] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupEdicao, setShowPopupEdicao] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [userData, setUserData] = useState(null);
    const cores = [
        { nome: 'Azul Neptuno', hex: '#0B2943' },
        { nome: 'Céu Mercúrio', hex: '#0091C4' },
        { nome: 'Ciano Júpiter', hex: '#67B2B5' },
        { nome: 'Vinho Baco', hex: '#7A3889' },
        { nome: 'Pêssego Juno', hex: '#F5ADC3' },
        { nome: 'Laranja Vulcano', hex: '#FB5E06' },
        { nome: 'Girassol Diana', hex: '#EA963C' },
        { nome: 'Amarelo Minerva', hex: '#F0C300' },
        { nome: 'Magenta Vénus', hex: '#F11867' },
        { nome: 'Musgo Marte', hex: '#6F8E82' },
        { nome: 'Limão Febo', hex: '#8CA252' },
        { nome: 'Erva Ceres', hex: '#57522D' },
    ];

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const desejoid = urlParams.get('ID_AREA');

        const url = RotaBanco + `/curso/listarAreaEspecifica?areaId=${desejoid}`;

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
                    throw new Error('Erro ao obter os detalhes da area');
                }
                return response.json();
            })
            .then(areaData => {
                setArea(areaData)
                setCor(areaData.COR)
            });
        setUserData(getUsuarioIdFromCookie());
    }, [RotaBanco]);


    function preencherFormulario(area) {
        return (
            <form id="curso-formulario">
                <div className="layout-vertical">
                    <div className="holder-dados">
                        <ChronnosInput
                            type="text"
                            id="nome"
                            value={area.NOME_AREA}
                            className="input-default"
                            onChange={(e) => handleInputChange(e, 'NOME_AREA')}
                        />
                    </div>

                </div>
            </form>
        );
    }

    function handleInputChange(event, field) {
        const value = event.target.value;
        setArea(prevState => ({
            ...prevState,
            [field]: value
        }));
    }

    const salvarAlteracoes = async event => {
        const formData = new FormData();
        formData.append('id_area', area.ID_AREA);
        formData.append('id_usuario', userData.ID_USUARIO);
        formData.append('nome', area.NOME_AREA);
        formData.append('cor', cor);

        const response = await fetch(RotaBanco + '/curso/editarArea', {
            method: 'POST',
            body: formData,
        })
        if (response.status == 200) {
            setShowPopupEdicao(true);
        }

    }

    const corFeedback = () => {
        if ("vibrate" in navigator) {
            navigator.vibrate([30, 50, 15]);
        }
    };

    function showDeleteConfirmation() {
        setShowConfirmation(true);
    }

    function confirmarDelete(confirmacao) {
        if (confirmacao) {
            const urlParams = new URLSearchParams(window.location.search);
            const cursoId = urlParams.get('ID_AREA');

            const url = RotaBanco + `/curso/excluirArea?areaId=${cursoId}`;


            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao excluir area');
                    }
                    setShowPopup(true);
                })
        }
        setShowConfirmation(false);
    }

    const handleClosePopup = () => {
        setShowPopup(false);
        setShowPopupEdicao(false)
        window.location.href = '/Home';
    };

    return (
        <>
            <MainMobile className="form-mob-cent">
                <h1>Editar um área</h1>
                <div>
                    {area && preencherFormulario(area)}
                </div>
                <div className="no-scrollbar" style={{ display: 'flex', direction: 'row', width: '100%', overflowY: 'scroll', gap: '0.5rem', borderRadius: '1rem' }}>
                    {cores.map((cor, index) => (<button style={{ backgroundColor: cor.hex }} className="button-color-picker" key={index} onClick={() => { setCor(cor.hex); corFeedback() }} >{cor.nome}</button>))}
                </div>
                <ChronnosButton id="editar-curso-btn" onClick={salvarAlteracoes} className="button-default">Salvar as edições</ChronnosButton>
                <ChronnosTitleInput title="Remover a área" format="delete" type="button" icon="rem-curso" cmd={{ onClick: showDeleteConfirmation }}>Remover a área</ChronnosTitleInput>
            </MainMobile>
            {showPopup && (
                <ChronnosPopUp title="Área excluida com sucesso!" btntxt="Retornar a Home" btntype="submit" cmd={{ onClick: handleClosePopup }}></ChronnosPopUp>
            )}
            {showPopupEdicao && (
                <ChronnosPopUp title="Área editada com sucesso!" btntxt="Retornar a Home" btntype="submit" cmd={{ onClick: handleClosePopup }}></ChronnosPopUp>
            )}
            {showConfirmation && (
                <>
                    <ChronnosPopUp btntxt="teste" title="teste" double="true" btntype1="button" btntxt1="botao1" cmd1={{}} btntype2="button" btntxt2="botao2" cmd2={{}}></ChronnosPopUp>
                    <div className="popup">
                        <h2>Tem certeza que deseja excluir esta área?</h2>
                        <div className="holder-double-button">
                        <ChronnosButton id="editar-curso-btn" onClick={() => confirmarDelete(true)} className="button-perigo">Sim</ChronnosButton>
                        <ChronnosButton id="editar-curso-btn" onClick={() => confirmarDelete(false)} className="button-default">Não</ChronnosButton>
                        </div>
                    </div>
                </>
            )}
            <Dock />
        </>
    );
};

export default EditarArea;
