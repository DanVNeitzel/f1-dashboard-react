import React, { useState, useEffect } from 'react';

const SessionFilter = ({ onSessionChange, currentSession }) => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [loading, setLoading] = useState(false);

  const containerStyle = {
    backgroundColor: '#15151f',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const filterGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  };

  const filterItemStyle = {
    display: 'flex',
    flexDirection: 'column'
  };

  const labelStyle = {
    color: '#9ca3af',
    fontSize: '12px',
    textTransform: 'uppercase',
    marginBottom: '8px',
    fontWeight: '600'
  };

  const selectStyle = {
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    border: '2px solid #2a2a3e',
    borderRadius: '6px',
    padding: '10px 12px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'border-color 0.2s'
  };

  const buttonStyle = {
    backgroundColor: '#e10600',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    alignSelf: 'flex-end',
    marginTop: 'auto'
  };

  const currentSessionInfoStyle = {
    backgroundColor: '#1a1a2e',
    padding: '12px',
    borderRadius: '6px',
    marginTop: '15px',
    borderLeft: '4px solid #22c55e'
  };

  const currentSessionTextStyle = {
    color: '#ffffff',
    fontSize: '13px',
    marginBottom: '5px'
  };

  const currentSessionDetailStyle = {
    color: '#9ca3af',
    fontSize: '11px'
  };

  // Gerar lista de anos (2018 até ano atual)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let year = currentYear; year >= 2018; year--) {
      yearList.push(year);
    }
    setYears(yearList);
  }, []);

  // Buscar meetings quando o ano muda
  useEffect(() => {
    const fetchMeetings = async () => {
      if (!selectedYear) return;
      
      setLoading(true);
      try {
        const response = await fetch(`https://api.openf1.org/v1/meetings?year=${selectedYear}`);
        const data = await response.json();
        
        // Ordenar meetings do mais recente para o mais antigo
        const sortedMeetings = data.sort((a, b) => 
          new Date(b.date_start) - new Date(a.date_start)
        );
        
        setMeetings(sortedMeetings);
        
        // Se houver meetings, selecionar o primeiro (mais recente)
        if (sortedMeetings.length > 0) {
          setSelectedMeeting(sortedMeetings[0].meeting_key);
        }
      } catch (error) {
        console.error('Erro ao buscar meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [selectedYear]);

  // Buscar sessões quando o meeting muda
  useEffect(() => {
    const fetchSessions = async () => {
      if (!selectedMeeting) return;
      
      setLoading(true);
      try {
        const response = await fetch(`https://api.openf1.org/v1/sessions?meeting_key=${selectedMeeting}`);
        const data = await response.json();
        
        // Ordenar sessões por data
        const sortedSessions = data.sort((a, b) => 
          new Date(a.date_start) - new Date(b.date_start)
        );
        
        setSessions(sortedSessions);
        
        // Se houver sessões, selecionar a última (geralmente a corrida)
        if (sortedSessions.length > 0) {
          const raceSession = sortedSessions.find(s => s.session_name === 'Race');
          setSelectedSession(raceSession ? raceSession.session_key : sortedSessions[sortedSessions.length - 1].session_key);
        }
      } catch (error) {
        console.error('Erro ao buscar sessões:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [selectedMeeting]);

  const handleApplyFilter = () => {
    if (selectedSession) {
      const session = sessions.find(s => s.session_key === parseInt(selectedSession));
      onSessionChange(selectedSession, session);
    }
  };

  const getSessionIcon = (sessionName) => {
    if (sessionName.includes('Race')) return '🏁';
    if (sessionName.includes('Qualifying')) return '⏱️';
    if (sessionName.includes('Practice') || sessionName.includes('Sprint')) return '🏎️';
    return '📋';
  };

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>
        🔍 Filtrar por Sessão
      </h3>

      <div style={filterGridStyle}>
        <div style={filterItemStyle}>
          <label style={labelStyle}>Ano</label>
          <select 
            style={selectStyle}
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            disabled={loading}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div style={filterItemStyle}>
          <label style={labelStyle}>Grande Prêmio</label>
          <select 
            style={selectStyle}
            value={selectedMeeting}
            onChange={(e) => setSelectedMeeting(parseInt(e.target.value))}
            disabled={loading || meetings.length === 0}
          >
            <option value="">Selecione um GP</option>
            {meetings.map(meeting => (
              <option key={meeting.meeting_key} value={meeting.meeting_key}>
                {meeting.country_name} - {meeting.location}
              </option>
            ))}
          </select>
        </div>

        <div style={filterItemStyle}>
          <label style={labelStyle}>Sessão</label>
          <select 
            style={selectStyle}
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            disabled={loading || sessions.length === 0}
          >
            <option value="">Selecione uma sessão</option>
            {sessions.map(session => (
              <option key={session.session_key} value={session.session_key}>
                {getSessionIcon(session.session_name)} {session.session_name}
              </option>
            ))}
          </select>
        </div>

        <div style={filterItemStyle}>
          <label style={labelStyle}>&nbsp;</label>
          <button 
            style={buttonStyle}
            onClick={handleApplyFilter}
            disabled={!selectedSession || loading}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#c10500')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#e10600')}
          >
            {loading ? 'Carregando...' : 'Aplicar Filtro'}
          </button>
        </div>
      </div>

      {currentSession && (
        <div style={currentSessionInfoStyle}>
          <div style={currentSessionTextStyle}>
            <strong>📺 Visualizando:</strong> {currentSession.session_name}
          </div>
          <div style={currentSessionDetailStyle}>
            {currentSession.meeting_official_name || currentSession.country_name} • {currentSession.circuit_short_name}
            {currentSession.date_start && ` • ${new Date(currentSession.date_start).toLocaleDateString('pt-BR')}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionFilter;
