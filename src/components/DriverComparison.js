import React, { useState, useEffect } from 'react';
import DriverSelector from './DriverSelector';
import ComparisonStats from './ComparisonStats';
import LapTimeChart from './LapTimeChart';

const DriverComparison = ({ raceData, sessionKey, lapsData = [] }) => {
  const [driver1, setDriver1] = useState(null);
  const [driver2, setDriver2] = useState(null);
  const [driver1Laps, setDriver1Laps] = useState([]);
  const [driver2Laps, setDriver2Laps] = useState([]);

  useEffect(() => {
    // Selecionar automaticamente os dois primeiros pilotos se disponíveis
    if (raceData.length >= 2 && !driver1 && !driver2) {
      setDriver1(raceData[0]);
      setDriver2(raceData[1]);
    }
  }, [raceData, driver1, driver2]);

  useEffect(() => {
    // Filtrar voltas do piloto 1
    if (driver1 && lapsData.length > 0) {
      const laps = lapsData
        .filter(lap => lap.driver_number === driver1.driverNumber)
        .sort((a, b) => a.lap_number - b.lap_number);
      setDriver1Laps(laps);
    } else {
      setDriver1Laps([]);
    }
  }, [driver1, lapsData]);
// 
  useEffect(() => {
    // Filtrar voltas do piloto 2
    if (driver2 && lapsData.length > 0) {
      const laps = lapsData
        .filter(lap => lap.driver_number === driver2.driverNumber)
        .sort((a, b) => a.lap_number - b.lap_number);
      setDriver2Laps(laps);
    } else {
      setDriver2Laps([]);
    }
  }, [driver2, lapsData]);

  const containerStyle = {
    padding: '20px',
    backgroundColor: '#15151f',
    borderRadius: '8px',
    marginBottom: '20px'
  };

  const headerStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const selectorsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '30px'
  };

  const vsStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#e10600',
    textAlign: 'center',
    margin: '20px 0',
    textTransform: 'uppercase',
    letterSpacing: '4px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        🏎️ ⚔️ Modo Comparação de Pilotos
      </div>

      {raceData.length < 2 ? (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          color: '#9ca3af',
          fontSize: '16px' 
        }}>
          ⚠️ Dados insuficientes para comparação. É necessário pelo menos 2 pilotos.
        </div>
      ) : (
        <>
          <div style={selectorsContainerStyle}>
            <DriverSelector
              drivers={raceData}
              selectedDriver={driver1}
              onSelectDriver={setDriver1}
              label="Piloto 1"
              excludeDriverNumber={driver2?.driverNumber}
            />
            <DriverSelector
              drivers={raceData}
              selectedDriver={driver2}
              onSelectDriver={setDriver2}
              label="Piloto 2"
              excludeDriverNumber={driver1?.driverNumber}
            />
          </div>

          {driver1 && driver2 && (
            <>
              <div style={vsStyle}>VS</div>

              <ComparisonStats 
                driver1={driver1} 
                driver2={driver2}
                driver1Laps={driver1Laps}
                driver2Laps={driver2Laps}
              />

              {(driver1Laps.length > 0 || driver2Laps.length > 0) && (
                <LapTimeChart
                  driver1={driver1}
                  driver2={driver2}
                  driver1Laps={driver1Laps}
                  driver2Laps={driver2Laps}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DriverComparison;
