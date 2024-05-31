import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';
import MainMobile from '../layouts/MainMobile/MainMobile';
import "./CursoEspecifico/styles.css"
import ChronnosTitleInput from '../inputs-buttons/ChronnosTitleInput/ChronnosTitleInput';
import Dock from '../dock/Dock';

const VisualizarDesejoEspecifico = () => {
  const { RotaBanco } = useGlobalContext();
  const [desejoCompleto, setDesejoCompleto] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('ID_DESEJO');

    const url = RotaBanco + `/desejo/listarCursoEspecifico?desejoId=${cursoId}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao obter os detalhes do desejo');
        }
        return response.json();
      })
      .then(desejoData => {
        const desejos = [desejoData];
        const tratamentoErro = error => ({ error });

        const areasPromises = desejos.map(desejo =>
          fetch(RotaBanco + `/curso/listarAreaEspecifica?areaId=${desejo.DESEJO_ID_AREA}`)
            .then(response => response.ok ? response.json() : tratamentoErro('Erro ao obter os detalhes da área'))
            .catch(error => tratamentoErro('Erro ao obter detalhes da área'))
        );

        const materiasPromises = desejos.map(desejo =>
          fetch(RotaBanco + `/curso/listarMateriaEspecifica?materiaId=${desejo.DESEJO_ID_MATERIA}`)
            .then(response => response.ok ? response.json() : tratamentoErro('Erro ao obter os detalhes da matéria'))
            .catch(error => tratamentoErro('Erro ao obter detalhes da matéria'))
        );

        Promise.all([...areasPromises, ...materiasPromises])
          .then(results => {
            const desejoCompleto = desejos.map((desejo, index) => {
              const areaResult = results[index * 2]; // A área está na posição par
              const materiaResult = results[index * 2 + 1]; // A matéria está na posição ímpar

              return {
                ...desejo,
                AREA_NOME: areaResult ? areaResult.NOME_AREA : 'Erro ao obter detalhes da área',
                AREA_COR: areaResult ? areaResult.COR : 'Erro ao obter cor',
                MATERIA_NOME: materiaResult ? materiaResult.NOME_MATERIA : 'Erro ao obter detalhes da matéria',
              };
            });
            setDesejoCompleto(desejoCompleto);
          })
          .catch(error => {
            console.error('Erro:', error);
          });
      })
  }, []); // Adicione quaisquer dependências necessárias aqui

  if (!desejoCompleto) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      {desejoCompleto.map(desejo => (
        <MainMobile className="form-mob">
          <div key={desejo.ID_CURSO} className="header-curso" style={{ backgroundColor: desejo.AREA_COR }}>
            <ChronnosTitleInput title={desejo.NOME} format="bold" icon="edit" type="a" cmd={{ href: `/EditarCurso?ID_CURSO=${desejo.ID_CURSO}` }}></ChronnosTitleInput>
            <p>{desejo.AREA_NOME} • {desejo.MATERIA_NOME}</p>
          </div>
          <div className="holder-split">
          <div className="holder-dados">
              <p>Link</p>
              <div className="campo-picker">
                {desejo.LINK}
              </div>
            </div>
            <div className="holder-dados">
              <p>Modalidade</p>
              <div className="campo-picker">
                {desejo.MODALIDADE}
              </div>
            </div>
          </div>
        </MainMobile>
      ))}
      <Dock></Dock>
    </>
  );
}

export default VisualizarDesejoEspecifico;
