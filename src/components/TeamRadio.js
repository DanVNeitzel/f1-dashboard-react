import React, { useState } from 'react';

const TeamRadio = ({ teamRadio, drivers }) => {
  const [selectedDriver, setSelectedDriver] = useState(null);

  const containerStyle = {
    backgroundColor: '#15151f',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    maxHeight: '500px',
    display: 'flex',
    flexDirection: 'column'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    borderBottom: '2px solid #22c55e',
    paddingBottom: '10px'
  };

  const radioListStyle = {
    overflowY: 'auto',
    flex: 1
  };

  const radioItemStyle = {
    backgroundColor: '#1a1a2e',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '10px',
    borderLeft: '4px solid #22c55e',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const driverNameStyle = {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: '14px',
    marginBottom: '5px'
  };

  const timeStyle = {
    color: '#9ca3af',
    fontSize: '11px',
    marginBottom: '8px'
  };

  const audioStyle = {
    width: '100%',
    height: '30px',
    marginTop: '8px'
  };

  const noDataStyle = {
    color: '#9ca3af',
    textAlign: 'center',
    padding: '20px'
  };

  const filterStyle = {
    marginBottom: '15px'
  };

  const selectStyle = {
    width: '100%',
    padding: '8px',
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    border: '1px solid #2a2a3e',
    borderRadius: '4px',
    fontSize: '14px'
  };

  const getDriverName = (driverNumber) => {
    const driver = drivers.find(d => d.driver_number === driverNumber);
    return driver ? driver.name_acronym : `#${driverNumber}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR');
  };

  // Filtrar e ordenar rádios (mais recentes primeiro)
  const filteredRadios = teamRadio
    .filter(radio => !selectedDriver || radio.driver_number === parseInt(selectedDriver))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 20); // Limitar a 20 mensagens

  // Obter lista única de pilotos que têm rádios
  const driversWithRadio = [...new Set(teamRadio.map(r => r.driver_number))];

  if (teamRadio.length === 0) {
    return (
      <div style={containerStyle}>
        <h3 style={titleStyle}>📻 Rádio da Equipe</h3>
        <p style={noDataStyle}>Nenhuma comunicação de rádio disponível</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>📻 Rádio da Equipe ({filteredRadios.length} mensagens)</h3>
      
      <div style={filterStyle}>
        <select 
          style={selectStyle}
          value={selectedDriver || ''}
          onChange={(e) => setSelectedDriver(e.target.value || null)}
        >
          <option value="">Todos os pilotos</option>
          {driversWithRadio.map(driverNum => (
            <option key={driverNum} value={driverNum}>
              {getDriverName(driverNum)}
            </option>
          ))}
        </select>
      </div>

      <div style={radioListStyle}>
        {filteredRadios.map((radio, index) => (
          <div key={index} style={radioItemStyle}>
            <div style={driverNameStyle}>
              {getDriverName(radio.driver_number)}
            </div>
            <div style={timeStyle}>
              {formatTime(radio.date)}
            </div>
            <audio 
              controls 
              style={audioStyle}
              preload="none"
            >
              <source src={radio.recording_url} type="audio/mpeg" />
              Seu navegador não suporta áudio.
            </audio>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamRadio;
