import React from 'react';

const RaceInfo = ({ session }) => {
  const containerStyle = {
    backgroundColor: '#15151f',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    marginBottom: '20px'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    borderBottom: '2px solid #e10600',
    paddingBottom: '10px'
  };

  const infoGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  };

  const infoItemStyle = {
    display: 'flex',
    flexDirection: 'column'
  };

  const labelStyle = {
    color: '#9ca3af',
    fontSize: '11px',
    textTransform: 'uppercase',
    marginBottom: '5px',
    fontWeight: '600'
  };

  const valueStyle = {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold'
  };

  const noDataStyle = {
    color: '#9ca3af',
    textAlign: 'center',
    padding: '20px'
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!session) {
    return (
      <div style={containerStyle}>
        <h3 style={titleStyle}>📍 Informações da Sessão</h3>
        <p style={noDataStyle}>Nenhuma sessão ativa encontrada</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>📍 Informações da Sessão</h3>
      <div style={infoGridStyle}>
        <div style={infoItemStyle}>
          <span style={labelStyle}>Corrida</span>
          <span style={valueStyle}>{session.meeting_official_name || session.country_name}</span>
        </div>
        <div style={infoItemStyle}>
          <span style={labelStyle}>Sessão</span>
          <span style={valueStyle}>{session.session_name}</span>
        </div>
        <div style={infoItemStyle}>
          <span style={labelStyle}>Circuito</span>
          <span style={valueStyle}>{session.circuit_short_name}</span>
        </div>
        <div style={infoItemStyle}>
          <span style={labelStyle}>Localização</span>
          <span style={valueStyle}>{session.location}, {session.country_name}</span>
        </div>
        <div style={infoItemStyle}>
          <span style={labelStyle}>Data Início</span>
          <span style={valueStyle}>{formatDate(session.date_start)}</span>
        </div>
        <div style={infoItemStyle}>
          <span style={labelStyle}>GMT Offset</span>
          <span style={valueStyle}>{session.gmt_offset}</span>
        </div>
      </div>
    </div>
  );
};

export default RaceInfo;
