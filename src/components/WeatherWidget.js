import React from 'react';

const WeatherWidget = ({ weather }) => {
  const latestWeather = weather && weather.length > 0 ? weather[weather.length - 1] : null;

  const containerStyle = {
    backgroundColor: '#15151f',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    borderBottom: '2px solid #3b82f6',
    paddingBottom: '10px'
  };

  const weatherGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px'
  };

  const weatherItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: '15px',
    borderRadius: '8px'
  };

  const iconStyle = {
    fontSize: '32px',
    marginBottom: '8px'
  };

  const labelStyle = {
    color: '#9ca3af',
    fontSize: '11px',
    textTransform: 'uppercase',
    marginBottom: '5px'
  };

  const valueStyle = {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: 'bold'
  };

  const noDataStyle = {
    color: '#9ca3af',
    textAlign: 'center',
    padding: '20px'
  };

  if (!latestWeather) {
    return (
      <div style={containerStyle}>
        <h3 style={titleStyle}>🌤️ Condições Meteorológicas</h3>
        <div style={{ 
          padding: '40px 20px', 
          textAlign: 'center', 
          color: '#9ca3af', 
          backgroundColor: '#1a1a2e', 
          borderRadius: '8px', 
          border: '1px solid #2a2a3e' 
        }}>
          <div style={{ fontSize: '48px', marginBottom: '15px' }}>⛅</div>
          <div style={{ fontSize: '16px', marginBottom: '10px', color: '#ffffff' }}>
            Clima Indisponível
          </div>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            O endpoint meteorológico contém muitos dados históricos (mais de 4MB).<br />
            Para evitar sobrecarga da API, este recurso está desabilitado.<br />
            <br />
            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>
              ℹ️ Dados essenciais de corrida disponíveis na tabela principal
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>🌤️ Condições Meteorológicas</h3>
      <div style={weatherGridStyle}>
        <div style={weatherItemStyle}>
          <div style={iconStyle}>🌡️</div>
          <span style={labelStyle}>Temp. Ar</span>
          <span style={valueStyle}>{latestWeather.air_temperature}°C</span>
        </div>
        
        <div style={weatherItemStyle}>
          <div style={iconStyle}>🏁</div>
          <span style={labelStyle}>Temp. Pista</span>
          <span style={valueStyle}>{latestWeather.track_temperature}°C</span>
        </div>
        
        <div style={weatherItemStyle}>
          <div style={iconStyle}>💧</div>
          <span style={labelStyle}>Umidade</span>
          <span style={valueStyle}>{latestWeather.humidity}%</span>
        </div>
        
        <div style={weatherItemStyle}>
          <div style={iconStyle}>🌧️</div>
          <span style={labelStyle}>Chuva</span>
          <span style={valueStyle}>{latestWeather.rainfall ? 'SIM' : 'NÃO'}</span>
        </div>
        
        <div style={weatherItemStyle}>
          <div style={iconStyle}>💨</div>
          <span style={labelStyle}>Vento</span>
          <span style={valueStyle}>{latestWeather.wind_speed} m/s</span>
        </div>
        
        <div style={weatherItemStyle}>
          <div style={iconStyle}>🧭</div>
          <span style={labelStyle}>Dir. Vento</span>
          <span style={valueStyle}>{latestWeather.wind_direction}°</span>
        </div>
        
        <div style={weatherItemStyle}>
          <div style={iconStyle}>⏱️</div>
          <span style={labelStyle}>Pressão</span>
          <span style={valueStyle}>{latestWeather.pressure} mbar</span>
        </div>
        
        <div style={weatherItemStyle}>
          <div style={iconStyle}>📅</div>
          <span style={labelStyle}>Última Atualização</span>
          <span style={{...valueStyle, fontSize: '12px'}}>
            {new Date(latestWeather.date).toLocaleTimeString('pt-BR')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
