import React, { useState } from 'react';

const BlockVisibilityMenu = ({ visibleBlocks, onToggleBlock }) => {
  const [isOpen, setIsOpen] = useState(false);

  const blockLabels = {
    sessionInfo: '📍 Informações da Sessão',
    weatherMap: '🌤️ Clima e Mapa',
    driverTable: '📊 Tabela de Pilotos',
    columnControls: '⚙️ Controle de Colunas',
    legend: '📖 Legenda',
    communications: '📡 Comunicações e Eventos'
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{
      position: 'sticky',
      top: '0',
      zIndex: 1000,
      backgroundColor: '#15151f',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '2px solid #2a2a3e',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Barra de Título */}
      <div
        onClick={toggleMenu}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '15px 20px',
          cursor: 'pointer',
          backgroundColor: isOpen ? '#2a2a3e' : '#15151f',
          borderRadius: '8px',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = '#1f1f2e';
        }}
        onMouseOut={(e) => {
          if (!isOpen) e.currentTarget.style.backgroundColor = '#15151f';
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{
            fontSize: '20px',
            transition: 'transform 0.2s'
          }}>
            👁️
          </span>
          <span style={{
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            Visibilidade dos Blocos
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <span style={{
            color: '#9ca3af',
            fontSize: '13px',
            fontWeight: '500'
          }}>
            {Object.values(visibleBlocks).filter(Boolean).length}/{Object.keys(visibleBlocks).length} visíveis
          </span>
          <span style={{
            fontSize: '18px',
            color: '#9ca3af',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}>
            ▼
          </span>
        </div>
      </div>

      {/* Painel de Controles */}
      {isOpen && (
        <div style={{
          padding: '20px',
          borderTop: '2px solid #2a2a3e',
          backgroundColor: '#1a1a28',
          borderRadius: '0 0 8px 8px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {Object.entries(blockLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => onToggleBlock(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: visibleBlocks[key] ? '#22c55e' : '#374151',
                  color: '#ffffff',
                  transition: 'all 0.2s',
                  boxShadow: visibleBlocks[key] ? '0 2px 8px rgba(34, 197, 94, 0.3)' : 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = visibleBlocks[key] 
                    ? '0 4px 12px rgba(34, 197, 94, 0.4)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = visibleBlocks[key] 
                    ? '0 2px 8px rgba(34, 197, 94, 0.3)' 
                    : 'none';
                }}
              >
                <span>{label}</span>
                <span style={{ fontSize: '18px' }}>
                  {visibleBlocks[key] ? '✓' : '✗'}
                </span>
              </button>
            ))}
          </div>

          {/* Ações Rápidas */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid #2a2a3e'
          }}>
            <button
              onClick={() => {
                Object.keys(visibleBlocks).forEach(key => {
                  if (!visibleBlocks[key]) onToggleBlock(key);
                });
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ✓ Mostrar Todos
            </button>
            <button
              onClick={() => {
                Object.keys(visibleBlocks).forEach(key => {
                  if (visibleBlocks[key]) onToggleBlock(key);
                });
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ✗ Ocultar Todos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockVisibilityMenu;
