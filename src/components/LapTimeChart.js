import React from 'react';

const LapTimeChart = ({ driver1, driver2, driver1Laps, driver2Laps }) => {
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

  const chartContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '400px',
    backgroundColor: '#15151f',
    borderRadius: '8px',
    padding: '20px',
    overflow: 'hidden'
  };

  const legendStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#15151f',
    borderRadius: '6px'
  };

  const legendItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    fontWeight: 'bold'
  };

  const legendColorStyle = (color) => ({
    width: '30px',
    height: '4px',
    backgroundColor: color,
    borderRadius: '2px'
  });

  // Combinar e normalizar dados
  const maxLaps = Math.max(
    driver1Laps.length > 0 ? Math.max(...driver1Laps.map(l => l.lap_number)) : 0,
    driver2Laps.length > 0 ? Math.max(...driver2Laps.map(l => l.lap_number)) : 0
  );

  if (maxLaps === 0) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>📈 Evolução dos Tempos de Volta</div>
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '14px'
        }}>
          ⚠️ Dados de voltas não disponíveis para gerar gráfico.
        </div>
      </div>
    );
  }

  // Filtrar apenas voltas válidas (com tempo > 0)
  const validDriver1Laps = driver1Laps.filter(lap => lap.lap_duration && lap.lap_duration > 0);
  const validDriver2Laps = driver2Laps.filter(lap => lap.lap_duration && lap.lap_duration > 0);

  // Encontrar min e max para escala
  const allLapTimes = [
    ...validDriver1Laps.map(l => l.lap_duration),
    ...validDriver2Laps.map(l => l.lap_duration)
  ];

  if (allLapTimes.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>📈 Evolução dos Tempos de Volta</div>
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: '#9ca3af',
          fontSize: '14px'
        }}>
          ⚠️ Nenhum tempo de volta válido para exibir.
        </div>
      </div>
    );
  }

  const minTime = Math.min(...allLapTimes);
  const maxTime = Math.max(...allLapTimes);
  const timeRange = maxTime - minTime;
  const padding = timeRange * 0.1; // 10% de padding

  // Função para converter tempo em posição Y
  const getYPosition = (time, height) => {
    const normalizedTime = (time - (minTime - padding)) / (timeRange + 2 * padding);
    return height - (normalizedTime * (height - 40)) - 20; // 20px padding top/bottom
  };

  // Função para converter número da volta em posição X
  const getXPosition = (lapNumber, width) => {
    return ((lapNumber - 1) / (maxLaps - 1)) * (width - 60) + 30; // 30px padding left/right
  };

  // Função para formatar tempo
  const formatTime = (duration) => {
    const totalSeconds = duration;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, '0')}`;
  };

  // Criar linhas SVG
  const createPath = (laps, color) => {
    if (laps.length === 0) return null;

    const points = laps.map(lap => ({
      x: getXPosition(lap.lap_number, 1000),
      y: getYPosition(lap.lap_duration, 360)
    }));

    const pathData = points.map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `L ${point.x} ${point.y}`;
    }).join(' ');

    return (
      <g key={color}>
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="5"
            fill={color}
            stroke="#0d0d15"
            strokeWidth="2"
          >
            <title>{`Volta ${laps[index].lap_number}: ${formatTime(laps[index].lap_duration)}`}</title>
          </circle>
        ))}
      </g>
    );
  };

  // Criar grid horizontal
  const createHorizontalGrid = () => {
    const lines = [];
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const y = (i / steps) * 320 + 20;
      const time = maxTime - (i / steps) * timeRange;
      lines.push(
        <g key={i}>
          <line
            x1="30"
            y1={y}
            x2="970"
            y2={y}
            stroke="#2a2a3e"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text
            x="10"
            y={y + 5}
            fill="#9ca3af"
            fontSize="12"
            textAnchor="end"
          >
            {formatTime(time).split(':')[1]}s
          </text>
        </g>
      );
    }
    return lines;
  };

  // Criar grid vertical (voltas)
  const createVerticalGrid = () => {
    const lines = [];
    const step = maxLaps > 50 ? 10 : maxLaps > 20 ? 5 : 1;
    
    for (let lap = 0; lap <= maxLaps; lap += step) {
      if (lap === 0) lap = 1; // Começar da volta 1
      const x = getXPosition(lap, 1000);
      lines.push(
        <g key={lap}>
          <line
            x1={x}
            y1="20"
            x2={x}
            y2="340"
            stroke="#2a2a3e"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text
            x={x}
            y="360"
            fill="#9ca3af"
            fontSize="12"
            textAnchor="middle"
          >
            L{lap}
          </text>
        </g>
      );
    }
    return lines;
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>📈 Evolução dos Tempos de Volta</div>

      <div style={legendStyle}>
        <div style={legendItemStyle}>
          <div style={legendColorStyle(`#${driver1.teamColor}`)}></div>
          <span style={{ color: '#ffffff' }}>
            #{driver1.driverNumber} {driver1.driver}
          </span>
        </div>
        <div style={legendItemStyle}>
          <div style={legendColorStyle(`#${driver2.teamColor}`)}></div>
          <span style={{ color: '#ffffff' }}>
            #{driver2.driverNumber} {driver2.driver}
          </span>
        </div>
      </div>

      <div style={chartContainerStyle}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 360"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid */}
          {createHorizontalGrid()}
          {createVerticalGrid()}

          {/* Linhas dos pilotos */}
          {createPath(validDriver1Laps, `#${driver1.teamColor}`)}
          {createPath(validDriver2Laps, `#${driver2.teamColor}`)}

          {/* Eixos */}
          <line x1="30" y1="340" x2="970" y2="340" stroke="#9ca3af" strokeWidth="2" />
          <line x1="30" y1="20" x2="30" y2="340" stroke="#9ca3af" strokeWidth="2" />

          {/* Labels dos eixos */}
          <text x="500" y="390" fill="#ffffff" fontSize="14" textAnchor="middle" fontWeight="bold">
            Número da Volta
          </text>
          <text x="15" y="180" fill="#ffffff" fontSize="14" textAnchor="middle" fontWeight="bold" transform="rotate(-90, 15, 180)">
            Tempo (segundos)
          </text>
        </svg>
      </div>

      <div style={{
        marginTop: '15px',
        padding: '12px',
        backgroundColor: '#15151f',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#9ca3af',
        textAlign: 'center'
      }}>
        💡 Passe o mouse sobre os pontos para ver os tempos exatos de cada volta
      </div>
    </div>
  );
};

export default LapTimeChart;
