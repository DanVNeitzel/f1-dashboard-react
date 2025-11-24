import React from 'react';

const ComparisonStats = ({ driver1, driver2, driver1Laps, driver2Laps }) => {
  const containerStyle = {
    backgroundColor: '#0d0d15',
    borderRadius: '8px',
    padding: '20px',
    marginTop: '20px'
  };

  const headerStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '20px',
    textAlign: 'center'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '20px',
    alignItems: 'center'
  };

  const statRowStyle = {
    display: 'contents'
  };

  const statLabelStyle = {
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    padding: '12px',
    backgroundColor: '#15151f',
    borderRadius: '6px'
  };

  const getStatValueStyle = (isBetter, isDriver1) => ({
    textAlign: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    color: isBetter ? '#22c55e' : '#ffffff',
    padding: '12px',
    backgroundColor: isDriver1 ? `#${driver1.teamColor}15` : `##${driver2.teamColor}15`,
    border: isBetter ? '2px solid #22c55e' : '2px solid #2a2a3e',
    borderRadius: '6px',
    transition: 'all 0.3s ease'
  });

  const dividerStyle = {
    height: '2px',
    backgroundColor: '#2a2a3e',
    margin: '20px 0',
    gridColumn: '1 / -1'
  };

  // Função para formatar tempo de volta
  const formatLapTime = (duration) => {
    if (!duration || duration === '-') return '-';
    if (typeof duration === 'string') return duration;
    const totalSeconds = duration;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, '0')}`;
  };

  // Calcular melhor volta de cada piloto das laps
  const getBestLap = (laps) => {
    if (!laps || laps.length === 0) return null;
    const validLaps = laps.filter(lap => lap.lap_duration && lap.lap_duration > 0);
    if (validLaps.length === 0) return null;
    return Math.min(...validLaps.map(lap => lap.lap_duration));
  };

  // Calcular média de tempo de volta
  const getAverageLapTime = (laps) => {
    if (!laps || laps.length === 0) return null;
    const validLaps = laps.filter(lap => lap.lap_duration && lap.lap_duration > 0);
    if (validLaps.length === 0) return null;
    const sum = validLaps.reduce((acc, lap) => acc + lap.lap_duration, 0);
    return sum / validLaps.length;
  };

  // Calcular velocidade máxima
  const getTopSpeed = (laps) => {
    if (!laps || laps.length === 0) return null;
    const validSpeeds = laps.filter(lap => lap.st_speed && lap.st_speed > 0).map(lap => lap.st_speed);
    if (validSpeeds.length === 0) return null;
    return Math.max(...validSpeeds);
  };

  // Calcular média de velocidade
  const getAverageSpeed = (laps) => {
    if (!laps || laps.length === 0) return null;
    const validSpeeds = laps.filter(lap => lap.st_speed && lap.st_speed > 0);
    if (validSpeeds.length === 0) return null;
    const sum = validSpeeds.reduce((acc, lap) => acc + lap.st_speed, 0);
    return sum / validSpeeds.length;
  };

  // Calcular melhor setor
  const getBestSector = (laps, sectorNum) => {
    if (!laps || laps.length === 0) return null;
    const sectorField = `duration_sector_${sectorNum}`;
    const validSectors = laps.filter(lap => lap[sectorField] && lap[sectorField] > 0);
    if (validSectors.length === 0) return null;
    return Math.min(...validSectors.map(lap => lap[sectorField]));
  };

  const driver1BestLap = getBestLap(driver1Laps);
  const driver2BestLap = getBestLap(driver2Laps);
  const driver1AvgLap = getAverageLapTime(driver1Laps);
  const driver2AvgLap = getAverageLapTime(driver2Laps);
  const driver1TopSpeed = getTopSpeed(driver1Laps);
  const driver2TopSpeed = getTopSpeed(driver2Laps);
  const driver1AvgSpeed = getAverageSpeed(driver1Laps);
  const driver2AvgSpeed = getAverageSpeed(driver2Laps);
  const driver1Sector1 = getBestSector(driver1Laps, 1);
  const driver2Sector1 = getBestSector(driver2Laps, 1);
  const driver1Sector2 = getBestSector(driver1Laps, 2);
  const driver2Sector2 = getBestSector(driver2Laps, 2);
  const driver1Sector3 = getBestSector(driver1Laps, 3);
  const driver2Sector3 = getBestSector(driver2Laps, 3);

  // Comparações
  const bestLapComparison = driver1BestLap && driver2BestLap ? (driver1BestLap < driver2BestLap ? 'driver1' : driver2BestLap < driver1BestLap ? 'driver2' : 'tie') : null;
  const avgLapComparison = driver1AvgLap && driver2AvgLap ? (driver1AvgLap < driver2AvgLap ? 'driver1' : driver2AvgLap < driver1AvgLap ? 'driver2' : 'tie') : null;
  const topSpeedComparison = driver1TopSpeed && driver2TopSpeed ? (driver1TopSpeed > driver2TopSpeed ? 'driver1' : driver2TopSpeed > driver1TopSpeed ? 'driver2' : 'tie') : null;
  const avgSpeedComparison = driver1AvgSpeed && driver2AvgSpeed ? (driver1AvgSpeed > driver2AvgSpeed ? 'driver1' : driver2AvgSpeed > driver1AvgSpeed ? 'driver2' : 'tie') : null;
  const sector1Comparison = driver1Sector1 && driver2Sector1 ? (driver1Sector1 < driver2Sector1 ? 'driver1' : driver2Sector1 < driver1Sector1 ? 'driver2' : 'tie') : null;
  const sector2Comparison = driver1Sector2 && driver2Sector2 ? (driver1Sector2 < driver2Sector2 ? 'driver1' : driver2Sector2 < driver1Sector2 ? 'driver2' : 'tie') : null;
  const sector3Comparison = driver1Sector3 && driver2Sector3 ? (driver1Sector3 < driver2Sector3 ? 'driver1' : driver2Sector3 < driver1Sector3 ? 'driver2' : 'tie') : null;
  const positionComparison = driver1.position < driver2.position ? 'driver1' : driver2.position < driver1.position ? 'driver2' : 'tie';

  const StatRow = ({ label, value1, value2, comparison }) => (
    <div style={statRowStyle}>
      <div style={getStatValueStyle(comparison === 'driver1', true)}>
        {value1 !== null && value1 !== undefined ? value1 : '-'}
      </div>
      <div style={statLabelStyle}>{label}</div>
      <div style={getStatValueStyle(comparison === 'driver2', false)}>
        {value2 !== null && value2 !== undefined ? value2 : '-'}
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>📊 Estatísticas Comparativas</div>

      <div style={statsGridStyle}>
        <StatRow
          label="Posição Final"
          value1={`P${typeof driver1.displayPosition === 'number' ? driver1.displayPosition : driver1.displayPosition}`}
          value2={`P${typeof driver2.displayPosition === 'number' ? driver2.displayPosition : driver2.displayPosition}`}
          comparison={positionComparison}
        />

        <div style={dividerStyle}></div>

        <StatRow
          label="Melhor Volta"
          value1={driver1BestLap ? formatLapTime(driver1BestLap) : driver1.bestLap}
          value2={driver2BestLap ? formatLapTime(driver2BestLap) : driver2.bestLap}
          comparison={bestLapComparison}
        />

        <StatRow
          label="Tempo Médio"
          value1={driver1AvgLap ? formatLapTime(driver1AvgLap) : '-'}
          value2={driver2AvgLap ? formatLapTime(driver2AvgLap) : '-'}
          comparison={avgLapComparison}
        />

        <div style={dividerStyle}></div>

        <StatRow
          label="Melhor Setor 1"
          value1={driver1Sector1 ? driver1Sector1.toFixed(3) + 's' : driver1.sector1}
          value2={driver2Sector1 ? driver2Sector1.toFixed(3) + 's' : driver2.sector1}
          comparison={sector1Comparison}
        />

        <StatRow
          label="Melhor Setor 2"
          value1={driver1Sector2 ? driver1Sector2.toFixed(3) + 's' : driver1.sector2}
          value2={driver2Sector2 ? driver2Sector2.toFixed(3) + 's' : driver2.sector2}
          comparison={sector2Comparison}
        />

        <StatRow
          label="Melhor Setor 3"
          value1={driver1Sector3 ? driver1Sector3.toFixed(3) + 's' : driver1.sector3}
          value2={driver2Sector3 ? driver2Sector3.toFixed(3) + 's' : driver2.sector3}
          comparison={sector3Comparison}
        />

        <div style={dividerStyle}></div>

        <StatRow
          label="Velocidade Máxima"
          value1={driver1TopSpeed ? `${driver1TopSpeed} km/h` : driver1.topSpeed !== '-' ? `${driver1.topSpeed} km/h` : '-'}
          value2={driver2TopSpeed ? `${driver2TopSpeed} km/h` : driver2.topSpeed !== '-' ? `${driver2.topSpeed} km/h` : '-'}
          comparison={topSpeedComparison}
        />

        <StatRow
          label="Velocidade Média"
          value1={driver1AvgSpeed ? `${driver1AvgSpeed.toFixed(1)} km/h` : '-'}
          value2={driver2AvgSpeed ? `${driver2AvgSpeed.toFixed(1)} km/h` : '-'}
          comparison={avgSpeedComparison}
        />

        <div style={dividerStyle}></div>

        <StatRow
          label="Pit Stops"
          value1={driver1.pit || 0}
          value2={driver2.pit || 0}
          comparison={driver1.pit < driver2.pit ? 'driver1' : driver2.pit < driver1.pit ? 'driver2' : 'tie'}
        />

        <StatRow
          label="Voltas Completadas"
          value1={driver1.lapNumber || 0}
          value2={driver2.lapNumber || 0}
          comparison={driver1.lapNumber > driver2.lapNumber ? 'driver1' : driver2.lapNumber > driver1.lapNumber ? 'driver2' : 'tie'}
        />

        <StatRow
          label="Gap para Líder"
          value1={driver1.leader}
          value2={driver2.leader}
          comparison={driver1.leaderGap < driver2.leaderGap ? 'driver1' : driver2.leaderGap > driver1.leaderGap ? 'driver2' : 'tie'}
        />
      </div>

      {(driver1Laps.length === 0 && driver2Laps.length === 0) && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fbbf2420',
          border: '1px solid #fbbf24',
          borderRadius: '6px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#fbbf24'
        }}>
          ⚠️ Dados detalhados de voltas não disponíveis. Ative o <strong>Modo Forçado</strong> para carregar estatísticas completas.
        </div>
      )}
    </div>
  );
};

export default ComparisonStats;
