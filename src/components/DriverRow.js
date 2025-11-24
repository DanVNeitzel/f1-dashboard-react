import React from 'react';
import MiniSector from './MiniSector';

const DriverRow = ({ 
  position,
  displayPosition, 
  driverNumber,
  driver, 
  teamName,
  teamColor,
  leader,
  tyre,
  bestLap,
  interval, 
  lastLap, 
  miniSectors,
  lastSector,
  pit,
  topSpeed,
  status,
  visibleColumns = {}
}) => {
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 12px',
    borderBottom: '1px solid #1a1a2e',
    backgroundColor: position % 2 === 0 ? '#0d0d15' : '#15151f',
    fontSize: '13px',
    transition: 'background-color 0.2s',
    opacity: (status === 'DNF' || status === 'DSQ') ? 0.7 : 1
  };

  const positionStyle = {
    width: '35px',
    fontWeight: 'bold',
    color: status === 'DSQ' ? '#f59e0b' : (status === 'DNF' ? '#ef4444' : '#ffffff'),
    textAlign: 'center',
    fontSize: '14px'
  };

  // Determinar o que exibir na posição
  const getPositionDisplay = () => {
    if (typeof displayPosition === 'number') {
      return displayPosition;
    }
    // Se for string (NC, DQ, etc)
    return displayPosition;
  };

  const driverStyle = {
    width: '100px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const driverBarStyle = {
    width: '4px',
    height: '28px',
    backgroundColor: `#${teamColor}`,
    borderRadius: '2px'
  };

  const driverNameStyle = {
    fontWeight: '700',
    color: '#ffffff',
    fontSize: '13px'
  };

  const leaderStyle = {
    width: '90px',
    color: leader === 'LEADER' ? '#22c55e' : '#60a5fa',
    fontWeight: leader === 'LEADER' ? 'bold' : 'normal',
    fontSize: '12px'
  };

  const getTyreColor = (tyreType) => {
    switch(tyreType?.toUpperCase()) {
      case 'SOFT': return '#e11d48'; // Vermelho
      case 'MEDIUM': return '#fbbf24'; // Amarelo
      case 'HARD': return '#f5f5f5'; // Branco
      case 'INTERMEDIATE': return '#22c55e'; // Verde
      case 'WET': return '#3b82f6'; // Azul
      default: return '#e11d48';
    }
  };

  const getTyreTextColor = (tyreType) => {
    return tyreType?.toUpperCase() === 'HARD' ? '#000000' : '#ffffff';
  };

  const tyreStyle = {
    width: '60px',
    color: getTyreTextColor(tyre),
    backgroundColor: getTyreColor(tyre),
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
    textAlign: 'center'
  };

  const bestLapStyle = {
    width: '90px',
    color: '#a855f7',
    fontWeight: '600',
    fontSize: '12px'
  };

  const intervalStyle = {
    width: '90px',
    color: '#22c55e',
    fontSize: '12px'
  };

  const lastLapStyle = {
    width: '90px',
    color: '#fbbf24',
    fontWeight: '600',
    fontSize: '12px'
  };

  const sectorsStyle = {
    display: 'flex',
    gap: '1px',
    flex: 1,
    minWidth: '200px',
    height: '24px'
  };

  const lastSectorStyle = {
    width: '90px',
    color: '#34d399',
    fontSize: '12px'
  };

  const pitStyle = {
    width: '50px',
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '12px'
  };

  const topSpeedStyle = {
    width: '70px',
    color: '#06b6d4',
    fontSize: '12px'
  };

  return (
    <div style={rowStyle}>
      {visibleColumns.position !== false && (
        <div style={positionStyle}>
          {getPositionDisplay()}
        </div>
      )}
      {visibleColumns.driver !== false && (
        <div style={driverStyle}>
          <div style={driverBarStyle}></div>
          <div style={driverNameStyle}>
            {driver}
            {status === 'DNF' && <span style={{ marginLeft: '6px', fontSize: '10px', color: '#ef4444', fontWeight: 'bold' }}>DNF</span>}
            {status === 'DSQ' && <span style={{ marginLeft: '6px', fontSize: '10px', color: '#f59e0b', fontWeight: 'bold' }}>DSQ</span>}
          </div>
        </div>
      )}
      {visibleColumns.leader !== false && <div style={leaderStyle}>{leader}</div>}
      {visibleColumns.tyre !== false && <div style={tyreStyle}>{tyre}</div>}
      {visibleColumns.bestLap !== false && <div style={bestLapStyle}>{bestLap}</div>}
      {visibleColumns.interval !== false && <div style={intervalStyle}>{interval}</div>}
      {visibleColumns.lastLap !== false && <div style={lastLapStyle}>{lastLap}</div>}
      {visibleColumns.miniSectors !== false && (
        <div style={sectorsStyle}>
          {miniSectors && miniSectors.length > 0 ? (
            miniSectors.map((sector, index) => (
              <MiniSector 
                key={index}
                value={sector.value}
                isBest={sector.isBest}
                isPersonalBest={sector.isPersonalBest}
                isYellow={sector.isYellow}
              />
            ))
          ) : (
            <div style={{ color: '#555', fontSize: '11px' }}>-</div>
          )}
        </div>
      )}
      {visibleColumns.lastSector !== false && <div style={lastSectorStyle}>{lastSector}</div>}
      {visibleColumns.pit !== false && <div style={pitStyle}>{pit > 0 ? `${pit} PIT` : '-'}</div>}
      {visibleColumns.topSpeed !== false && <div style={topSpeedStyle}>{topSpeed !== '-' ? `${topSpeed} km/h` : '-'}</div>}
    </div>
  );
};

export default DriverRow;
