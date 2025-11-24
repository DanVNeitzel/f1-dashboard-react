import React from 'react';

const RaceMap = ({ locations, drivers }) => {
  // Criar mapa visual mesmo sem dados de localização GPS
  const hasLocationData = locations && locations.length > 0;
  
  if (!hasLocationData) {
    // Renderizar mapa placeholder com pilotos em grid quando não há dados GPS
    return (
      <div style={{ backgroundColor: '#15151f', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}>
        <h3 style={{ color: '#ffffff', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #a855f7', paddingBottom: '10px' }}>
          🗺️ Mapa da Corrida em Tempo Real
        </h3>
        <div style={{ 
          backgroundColor: '#1a1a2e', 
          borderRadius: '8px', 
          border: '1px solid #2a2a3e',
          padding: '20px',
          minHeight: '350px'
        }}>
          {drivers && drivers.length > 0 ? (
            <>
              <div style={{ 
                fontSize: '14px', 
                color: '#fbbf24', 
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: '#1e293b',
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                ⚠️ Dados GPS não disponíveis - Exibindo pilotos em grid
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '10px',
                padding: '10px'
              }}>
                {drivers.map((driver, index) => (
                  <div
                    key={driver.driver_number}
                    style={{
                      backgroundColor: `#${driver.team_colour || 'ffffff'}`,
                      color: '#000000',
                      padding: '10px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      border: '2px solid #ffffff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                  >
                    <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '3px' }}>
                      P{index + 1}
                    </div>
                    <div>
                      {driver.name_acronym || driver.driver_number}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏁</div>
              <div style={{ fontSize: '16px', marginBottom: '10px', color: '#ffffff' }}>
                Aguardando dados dos pilotos
              </div>
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                Carregando informações da corrida...
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Encontrar os limites dos dados de localização
  const xValues = locations.map(loc => loc.x);
  const yValues = locations.map(loc => loc.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  // Dimensões do SVG
  const width = 600;
  const height = 400;
  const padding = 20;

  // Função para normalizar coordenadas para o SVG
  const normalizeX = (x) => ((x - minX) / (maxX - minX)) * (width - 2 * padding) + padding;
  const normalizeY = (y) => ((y - minY) / (maxY - minY)) * (height - 2 * padding) + padding;

  // Agrupar localizações por driver (mais recente)
  const latestLocations = {};
  locations.forEach(loc => {
    const driverNum = loc.driver_number;
    if (!latestLocations[driverNum] || new Date(loc.date) > new Date(latestLocations[driverNum].date)) {
      latestLocations[driverNum] = loc;
    }
  });

  // Mapear drivers para cores
  const driverColors = {};
  drivers.forEach(driver => {
    driverColors[driver.driver_number] = driver.team_colour ? `#${driver.team_colour}` : '#ffffff';
  });

  return (
    <div style={{ backgroundColor: '#15151f', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}>
      <h3 style={{ color: '#ffffff', marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid #a855f7', paddingBottom: '10px' }}>
        🗺️ Mapa da Corrida em Tempo Real
      </h3>
      <svg width={width} height={height} style={{ backgroundColor: '#1a1a2e', border: '1px solid #2a2a3e', borderRadius: '4px', width: '100%' }}>
        {Object.values(latestLocations).map(loc => {
          const driver = drivers.find(d => d.driver_number === loc.driver_number);
          const color = driverColors[loc.driver_number] || '#ffffff';
          const x = normalizeX(loc.x);
          const y = normalizeY(loc.y);
          const name = driver ? driver.name_acronym : loc.driver_number;

          return (
            <g key={loc.driver_number}>
              <circle
                cx={x}
                cy={y}
                r="6"
                fill={color}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontWeight="bold"
              >
                {name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default RaceMap;
