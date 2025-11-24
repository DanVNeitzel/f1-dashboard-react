import React from 'react';

const RaceControl = ({ raceControl, drivers }) => {
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
    borderBottom: '2px solid #fbbf24',
    paddingBottom: '10px'
  };

  const eventListStyle = {
    overflowY: 'auto',
    flex: 1
  };

  const eventItemStyle = (category) => ({
    backgroundColor: '#1a1a2e',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '10px',
    borderLeft: `4px solid ${getCategoryColor(category)}`,
    transition: 'all 0.2s'
  });

  const categoryBadgeStyle = (category) => ({
    display: 'inline-block',
    backgroundColor: getCategoryColor(category),
    color: category === 'Flag' ? '#000000' : '#ffffff',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 'bold',
    marginRight: '8px',
    textTransform: 'uppercase'
  });

  const flagBadgeStyle = (flag) => ({
    display: 'inline-block',
    backgroundColor: getFlagColor(flag),
    color: flag === 'YELLOW' || flag === 'GREEN' ? '#000000' : '#ffffff',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 'bold',
    marginLeft: '8px',
    textTransform: 'uppercase'
  });

  const messageStyle = {
    color: '#ffffff',
    fontSize: '13px',
    marginTop: '8px',
    lineHeight: '1.5'
  };

  const timeStyle = {
    color: '#9ca3af',
    fontSize: '11px',
    marginTop: '5px'
  };

  const noDataStyle = {
    color: '#9ca3af',
    textAlign: 'center',
    padding: '20px'
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Flag': return '#fbbf24';
      case 'SafetyCar': return '#ef4444';
      case 'Drs': return '#22c55e';
      case 'CarEvent': return '#3b82f6';
      default: return '#9ca3af';
    }
  };

  const getFlagColor = (flag) => {
    if (!flag) return '#9ca3af';
    if (flag.includes('YELLOW')) return '#fbbf24';
    if (flag.includes('RED')) return '#ef4444';
    if (flag.includes('GREEN')) return '#22c55e';
    if (flag.includes('BLACK')) return '#000000';
    if (flag.includes('CHEQUERED')) return '#ffffff';
    return '#9ca3af';
  };

  const getDriverName = (driverNumber) => {
    if (!driverNumber) return '';
    const driver = drivers.find(d => d.driver_number === driverNumber);
    return driver ? driver.name_acronym : `#${driverNumber}`;
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR');
  };

  // Ordenar eventos (mais recentes primeiro)
  const sortedEvents = [...raceControl]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 30); // Limitar a 30 eventos

  if (raceControl.length === 0) {
    return (
      <div style={containerStyle}>
        <h3 style={titleStyle}>🚦 Controle da Corrida</h3>
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center', 
          color: '#9ca3af', 
          backgroundColor: '#1a1a2e', 
          borderRadius: '8px', 
          border: '1px solid #2a2a3e' 
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏴</div>
          <div style={{ fontSize: '16px', marginBottom: '10px', color: '#ffffff' }}>
            Race Control Indisponível
          </div>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            O endpoint de controle da corrida contém muitos dados históricos (mais de 4MB).<br />
            Para evitar sobrecarga da API, este recurso está desabilitado.<br />
            <br />
            <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
              ℹ️ Veja os dados de timing e posições na tabela principal
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>🚦 Controle da Corrida ({sortedEvents.length} eventos)</h3>
      
      <div style={eventListStyle}>
        {sortedEvents.map((event, index) => (
          <div key={index} style={eventItemStyle(event.category)}>
            <div>
              <span style={categoryBadgeStyle(event.category)}>{event.category}</span>
              {event.flag && (
                <span style={flagBadgeStyle(event.flag)}>{event.flag}</span>
              )}
              {event.driver_number && (
                <span style={{color: '#22c55e', fontWeight: 'bold', marginLeft: '8px'}}>
                  {getDriverName(event.driver_number)}
                </span>
              )}
              {event.lap_number && (
                <span style={{color: '#9ca3af', fontSize: '11px', marginLeft: '8px'}}>
                  Volta {event.lap_number}
                </span>
              )}
            </div>
            <div style={messageStyle}>
              {event.message}
            </div>
            <div style={timeStyle}>
              {formatTime(event.date)}
              {event.sector && ` • Setor ${event.sector}`}
              {event.scope && ` • ${event.scope}`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RaceControl;
