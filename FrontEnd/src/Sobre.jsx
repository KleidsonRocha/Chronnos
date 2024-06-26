import React from 'react';
import "./Assets/utility.css"
import "./Components/Sobre/styles.css"
import homeButton from "./Components/inputs-buttons/home-button/chronnos-home-button.png";
import organizar from "./Components/Sobre/images/organizar/organizar.png";
import funcionadevframe from "./Components/Sobre/images/funciona/funciona.png";
import recursosdevframe from "./Components/Sobre/images/recursos/timeline-comp.png"
import recursostimelinedevframe from "./Components/Sobre/images/recursos/timeline.png"


const Sobre = () => {
    return (
        <>
            <div className="navbar">
                <div className="navbar-group">
                    <a href="#header"><img src={homeButton} /></a>
                    <div className="only-desk-navbar-group">
                        <a href="#introducao">Introdução</a>
                        <a href="#como-funciona">Como funciona?</a>
                        <a href="#recursos">Recursos</a>
                    </div>
                </div>
                <div className="navbar-group">
                    <a href="/Login">Login</a>
                    <a href="/Cadastro">Cadastre-se</a>
                </div>
            </div>
            <div className="header" id="header">
                <div className="texto">
                    <h1>
                        Chronnos
                    </h1>
                    <h2>
                        A sua carteira digital de cursos e certificados.
                    </h2>
                </div>
            </div>
            <div className="frame" id="introducao">
                <div className="organizar">
                    <img src={organizar} />
                </div>
                <div className="texto">
                    <h1>
                        Bora se organizar?
                    </h1>
                    <p>
                        Esqueça o bloco de notas, grupos de WhatsApp solitários e arquivos perdidos na área de trabalho... Tudo isso acabou.
                    </p>
                    <p>
                        O Chronnos unifica todas as informações, anotações e certificados dos seus cursos em um único lugar.
                    </p>
                </div>
            </div>
            <div className="frame" id="como-funciona">
                <div className="texto">
                    <h1>
                        Como funciona?
                    </h1>
                    <p>
                        Fale um pouco sobre o curso.
                    </p>
                    <p>
                        De que área ele pertence? Qual matéria ele aborda? Por fim, é sobre o que este curso?
                    </p>
                    <p>
                        Com as informações, anexe o certificado, e pronto, o Chronnos lembrará de tudo.
                    </p>
                </div>
                <img src={funcionadevframe} className="funciona" />
            </div>
            <div className="frame" id="recursos">
                <div className="recursos">
                    <img src={recursosdevframe} />
                    <img src={recursostimelinedevframe} />
                </div>
                <div className="texto">
                    <h1>
                        Os recursos
                    </h1>
                    <p>
                        Como diferencial, o Chronnos te concede uma linha do tempo completa com todo seu histórico acadêmico, gráficos e estatísticas.
                    </p>
                    <p>
                        A Timeline pode ser compartilhada em currículos, perfis sociais e onde mais preferir.
                    </p>
                </div>
            </div>
            <div className="footer-about">
                <div className="logo-footer">
                    <img src={homeButton} />
                    <h1>Chronnos</h1>
                </div>
                <a href="https://github.com/KleidsonRocha/Chronnos" target="_blank">Repositório do projeto</a>
                <p>
                    Criado para o Projeto Integrador 3, Ciências da Computação, URI
                </p>
                <p>
                    Desenvolvido por João Guilherme S. Piccolo, Kleidson Matos da Rocha, Matheus Wastchuk e Vinícius Alexandre Lucas.
                </p>
            </div>
        </>
    );
};

export default Sobre;