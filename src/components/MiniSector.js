import React from 'react';

const MiniSector = ({ value, isBest, isPersonalBest, isYellow }) => {
  let backgroundColor = '#2a2a3e'; // Neutro/cinza escuro

  if (isBest) {
    backgroundColor = '#a855f7'; // Roxo - melhor geral (purple sector)
  } else if (isPersonalBest) {
    backgroundColor = '#22c55e'; // Verde - melhor pessoal (green sector)
  } else if (isYellow || value === 2048) {
    backgroundColor = '#fbbf24'; // Amarelo - tempo normal
  } else if (value === 2064) {
    backgroundColor = '#ef4444'; // Vermelho - pit lane
  } else if (value > 0) {
    backgroundColor = '#3b82f6'; // Azul - tempo normal
  }

  const style = {
    backgroundColor,
    flex: 1,
    minWidth: '4px',
    height: '100%',
    borderRadius: '1px',
    transition: 'background-color 0.3s'
  };

  return <div style={style}></div>;
};

export default MiniSector;
