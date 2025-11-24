import React from 'react';

const NoSessionModal = ({ nextSession, upcomingSessions, onClose }) => {
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(5px)'
  };

  const modalStyle = {
    backgroundColor: '#15151f',
    borderRadius: '12px',
    padding: '30px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
    border: '2px solid #e10600',
    position: 'relative'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '5px 10px',
    transition: 'color 0.2s'
  };

  const titleStyle = {
    color: '#e10600',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };

  const iconStyle = {
    fontSize: '36px'
  };

  const messageStyle = {
    color: '#ffffff',
    fontSize: '16px',
    marginBottom: '25px',
    lineHeight: '1.6'
  };

  const nextSessionBoxStyle = {
    backgroundColor: '#1a1a2e',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '25px',
    border: '2px solid #22c55e'
  };

  const nextSessionTitleStyle = {
    color: '#22c55e',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid #2a2a3e'
  };

  const labelStyle = {
    color: '#9ca3af',
    fontSize: '13px',
    textTransform: 'uppercase'
  };

  const valueStyle = {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'right'
  };

  const upcomingTitleStyle = {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    marginTop: '20px'
  };

  const sessionItemStyle = {
    backgroundColor: '#1a1a2e',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '10px',
    borderLeft: '4px solid #3b82f6'
  };

  const sessionNameStyle = {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px'
  };

  const sessionDateStyle = {
    color: '#9ca3af',
    fontSize: '12px'
  };

  const buttonStyle = {
    backgroundColor: '#e10600',
    color: '#ffffff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
    width: '100%',
    transition: 'background-color 0.2s'
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCountdown = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const target = new Date(dateString);
    const diff = target - now;
    
    if (diff < 0) return 'Em andamento';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `Em ${days} dia${days > 1 ? 's' : ''} e ${hours}h`;
    }
    return `Em ${hours} hora${hours > 1 ? 's' : ''}`;
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button 
          style={closeButtonStyle} 
          onClick={onClose}
          onMouseOver={(e) => e.target.style.color = '#ffffff'}
          onMouseOut={(e) => e.target.style.color = '#9ca3af'}
        >
          ×
        </button>

        <h2 style={titleStyle}>
          <span style={iconStyle}>🏁</span>
          Nenhuma Sessão Ativa
        </h2>

        <p style={messageStyle}>
          Não há nenhuma sessão de Fórmula 1 acontecendo no momento. 
          O dashboard mostrará dados históricos da última sessão disponível.
        </p>

        {nextSession && (
          <div style={nextSessionBoxStyle}>
            <h3 style={nextSessionTitleStyle}>
              🎯 Próxima Sessão
            </h3>
            
            <div style={infoRowStyle}>
              <span style={labelStyle}>Evento</span>
              <span style={valueStyle}>{nextSession.meeting_official_name || nextSession.country_name}</span>
            </div>
            
            <div style={infoRowStyle}>
              <span style={labelStyle}>Sessão</span>
              <span style={valueStyle}>{nextSession.session_name}</span>
            </div>
            
            <div style={infoRowStyle}>
              <span style={labelStyle}>Circuito</span>
              <span style={valueStyle}>{nextSession.circuit_short_name}</span>
            </div>
            
            <div style={infoRowStyle}>
              <span style={labelStyle}>Localização</span>
              <span style={valueStyle}>{nextSession.location}, {nextSession.country_name}</span>
            </div>
            
            <div style={infoRowStyle}>
              <span style={labelStyle}>Data e Hora</span>
              <span style={valueStyle}>{formatDate(nextSession.date_start)}</span>
            </div>
            
            <div style={{...infoRowStyle, borderBottom: 'none'}}>
              <span style={labelStyle}>Contagem Regressiva</span>
              <span style={{...valueStyle, color: '#22c55e'}}>{getCountdown(nextSession.date_start)}</span>
            </div>
          </div>
        )}

        {upcomingSessions && upcomingSessions.length > 0 && (
          <>
            <h3 style={upcomingTitleStyle}>📅 Próximas Sessões</h3>
            {upcomingSessions.slice(0, 5).map((session, index) => (
              <div key={index} style={sessionItemStyle}>
                <div style={sessionNameStyle}>
                  {session.session_name} - {session.country_name}
                </div>
                <div style={sessionDateStyle}>
                  {formatShortDate(session.date_start)} • {session.circuit_short_name}
                </div>
              </div>
            ))}
          </>
        )}

        <button 
          style={buttonStyle}
          onClick={onClose}
          onMouseOver={(e) => e.target.style.backgroundColor = '#c10500'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#e10600'}
        >
          Continuar com Dados Históricos
        </button>
      </div>
    </div>
  );
};

export default NoSessionModal;
