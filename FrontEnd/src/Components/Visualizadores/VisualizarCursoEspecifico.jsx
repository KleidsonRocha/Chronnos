import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../App';

const CadastroCursoEspecifico = () => {
  const { RotaBanco } = useGlobalContext();

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
        const cursos = [cursoData]; // Coloque o curso retornado em um array
        const tratamentoErro = error => ({ error });

        const areasPromises = cursos.map(curso =>
          fetch(RotaBanco + `/curso/listarAreaEspecifica?areaId=${curso.AREA}`)
            .then(response => response.ok ? response.json() : tratamentoErro('Erro ao obter os detalhes da área'))
            .then(areaData => ({ ...curso, AREA_NOME: areaData.NOME_AREA, AREA_COR: areaData.COR }))
            .catch(error => tratamentoErro('Erro ao obter detalhes da área'))
        );

        const materiasPromises = cursos.map(curso =>
          fetch(RotaBanco + `/curso/listarMateriaEspecifica?materiaId=${curso.MATERIA}`)
            .then(response => response.ok ? response.json() : tratamentoErro('Erro ao obter os detalhes da matéria'))
            .then(materiaData => ({ ...curso, MATERIA_NOME: materiaData.NOME_MATERIA }))
            .catch(error => tratamentoErro('Erro ao obter detalhes da matéria'))
        );

        const pagamentoPromises = cursos.map(curso =>
          fetch(RotaBanco + `/curso/listarPagamentoEspecifico?pagamentoId=${curso.PAGAMENTO}`)
            .then(response => response.ok ? response.json() : tratamentoErro('Erro ao obter os detalhes do pagamento'))
            .then(pagamentoData => {
              const pagamento = JSON.parse(pagamentoData[0].pagamento);
              return { ...curso, PAGAMENTO_NOME: pagamento.TIPO };
            })
            .catch(error => tratamentoErro('Erro ao obter detalhes de pagamento'))
        );

        Promise.all([...areasPromises, ...materiasPromises, ...pagamentoPromises])
          .then(results => {
            const cursosCompleto = cursos.map(curso => {
              const areaResult = results.find(result => result.AREA);
              const materiaResult = results.find(result => result.MATERIA_NOME);
              const pagamentoResult = results.find(result => result.PAGAMENTO_NOME);
              return {
                ...curso,
                AREA_NOME: areaResult ? areaResult.AREA_NOME : 'Erro ao obter detalhes da área',
                AREA_COR: areaResult ? areaResult.AREA_COR : 'Erro',
                MATERIA_NOME: materiaResult ? materiaResult.MATERIA_NOME : 'Erro ao obter detalhes da matéria',
                PAGAMENTO_NOME: pagamentoResult ? pagamentoResult.PAGAMENTO_NOME : 'Erro ao obter detalhes de pagamento',
              };
            });
            console.log(cursosCompleto);
          })
          .catch(error => {
            console.error('Erro:', error);
          });
      })
      .catch(error => {
        console.error('Erro:', error);
      });
  }, [RotaBanco]);

  return (
    <>
      {/* Seu JSX aqui */}
    </>
  );
}

export default CadastroCursoEspecifico;
