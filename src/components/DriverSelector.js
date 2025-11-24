import React from 'react';

const DriverSelector = ({ drivers, selectedDriver, onSelectDriver, label, excludeDriverNumber }) => {
  const containerStyle = {
    backgroundColor: '#0d0d15',
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid #2a2a3e'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#9ca3af',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  const selectedDriverStyle = {
    backgroundColor: selectedDriver ? `#${selectedDriver.teamColor}15` : '#15151f',
    border: selectedDriver ? `3px solid #${selectedDriver.teamColor}` : '3px solid #2a2a3e',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '15px',
    transition: 'all 0.3s ease'
  };

  const driverInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  };

  const driverBarStyle = {
    width: '6px',
    height: '60px',
    backgroundColor: selectedDriver ? `#${selectedDriver.teamColor}` : '#666',
    borderRadius: '3px'
  };

  const driverDetailsStyle = {
    flex: 1
  };

  const driverNameStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '5px'
  };

  const driverNumberStyle = {
    display: 'inline-block',
    backgroundColor: selectedDriver ? `#${selectedDriver.teamColor}` : '#666',
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginRight: '10px'
  };

  const teamNameStyle = {
    fontSize: '14px',
    color: '#9ca3af',
    marginTop: '5px'
  };

  const positionBadgeStyle = {
    backgroundColor: selectedDriver?.position <= 3 ? '#fbbf24' : '#374151',
    color: selectedDriver?.position <= 3 ? '#000000' : '#ffffff',
    padding: '8px 16px',
    borderRadius: '6px',
    fontSize: '20px',
    fontWeight: 'bold',
    textAlign: 'center'
  };

  const dropdownStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#15151f',
    border: '2px solid #2a2a3e',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const optionStyle = {
    padding: '10px',
    backgroundColor: '#15151f'
  };

  const filteredDrivers = drivers.filter(d => d.driverNumber !== excludeDriverNumber);

  return (
    <div style={containerStyle}>
      <div style={labelStyle}>{label}</div>

      {selectedDriver && (
        <div style={selectedDriverStyle}>
          <div style={driverInfoStyle}>
            <div style={driverBarStyle}></div>
            <div style={driverDetailsStyle}>
              <div style={driverNameStyle}>
                <span style={driverNumberStyle}>#{selectedDriver.driverNumber}</span>
                {selectedDriver.driver}
              </div>
              <div style={teamNameStyle}>{selectedDriver.teamName}</div>
              <div style={{ marginTop: '10px' }}>
                <span style={{
                  backgroundColor: selectedDriver.tyre === 'SOFT' ? '#e11d48' : 
                                  selectedDriver.tyre === 'MEDIUM' ? '#fbbf24' : 
                                  selectedDriver.tyre === 'HARD' ? '#f5f5f5' : '#22c55e',
                  color: selectedDriver.tyre === 'HARD' ? '#000000' : '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginRight: '10px'
                }}>
                  {selectedDriver.tyre}
                </span>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {selectedDriver.pit > 0 ? `${selectedDriver.pit} PIT STOP${selectedDriver.pit > 1 ? 'S' : ''}` : 'Sem pit stops'}
                </span>
              </div>
            </div>
            <div style={positionBadgeStyle}>
              P{typeof selectedDriver.displayPosition === 'number' ? selectedDriver.displayPosition : selectedDriver.displayPosition}
            </div>
          </div>
        </div>
      )}

      <select
        style={dropdownStyle}
        value={selectedDriver?.driverNumber || ''}
        onChange={(e) => {
          const driver = drivers.find(d => d.driverNumber === parseInt(e.target.value));
          onSelectDriver(driver);
        }}
        onFocus={(e) => e.target.style.borderColor = '#e10600'}
        onBlur={(e) => e.target.style.borderColor = '#2a2a3e'}
      >
        <option value="" style={optionStyle}>Selecione um piloto</option>
        {filteredDrivers.map(driver => (
          <option 
            key={driver.driverNumber} 
            value={driver.driverNumber}
            style={optionStyle}
          >
            P{typeof driver.displayPosition === 'number' ? driver.displayPosition : driver.displayPosition} - #{driver.driverNumber} {driver.driver} ({driver.teamName})
          </option>
        ))}
      </select>
    </div>
  );
};

export default DriverSelector;
