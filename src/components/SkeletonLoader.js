import React from 'react';

const SkeletonLoader = ({ isForced = false, message = null }) => {
  const skeletonStyle = {
    backgroundColor: '#1a1a2e',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative'
  };

  const shimmerStyle = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    height: '100%',
    width: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
    animation: 'shimmer 2s infinite'
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '1800px',
    margin: '0 auto',
    backgroundColor: '#0d0d15',
    minHeight: '100vh'
  };

  const headerSkeletonStyle = {
    ...skeletonStyle,
    height: '80px',
    marginBottom: '20px'
  };

  const warningSkeletonStyle = {
    ...skeletonStyle,
    height: '120px',
    marginBottom: '20px'
  };

  const filterSkeletonStyle = {
    ...skeletonStyle,
    height: '60px',
    marginBottom: '20px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const cardSkeletonStyle = {
    ...skeletonStyle,
    height: '200px'
  };

  const tableHeaderStyle = {
    ...skeletonStyle,
    height: '50px',
    marginBottom: '10px'
  };

  const tableRowStyle = {
    ...skeletonStyle,
    height: '60px',
    marginBottom: '8px'
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }

          @keyframes shimmer {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      
      <div style={containerStyle}>
        {/* Loading Text - Movido para o topo */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          <div style={{ 
            marginBottom: '15px', 
            fontSize: '48px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}>
            🏎️
          </div>
          <div style={{ fontSize: '20px', marginBottom: '10px' }}>
            Carregando dados da corrida...
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#888', 
            marginTop: '10px' 
          }}>
            Buscando informações mais recentes da API OpenF1
          </div>
          
          {message && (
            <div style={{ 
              fontSize: '14px', 
              color: '#fbbf24', 
              marginTop: '15px',
              backgroundColor: '#1a1a2e',
              padding: '15px',
              borderRadius: '8px',
              maxWidth: '600px',
              margin: '15px auto'
            }}>
              {message}
            </div>
          )}
          
          {isForced && (
            <div style={{
              marginTop: '20px',
              fontSize: '13px',
              color: '#3b82f6',
              backgroundColor: '#1e293b',
              padding: '12px 20px',
              borderRadius: '8px',
              maxWidth: '500px',
              margin: '20px auto'
            }}>
              💡 Este processo pode demorar até 30 segundos.<br/>
              Acompanhe o progresso no Console (F12)
            </div>
          )}

          {/* Spinner */}
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #1a1a2e',
            borderTop: '4px solid #e10600',
            borderRadius: '50%',
            margin: '20px auto',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>

        {/* Header Skeleton */}
        <div style={headerSkeletonStyle}>
          <div style={shimmerStyle}></div>
        </div>

        {/* Warning Skeleton */}
        <div style={warningSkeletonStyle}>
          <div style={shimmerStyle}></div>
        </div>

        {/* Force Load Option Skeleton */}
        <div style={warningSkeletonStyle}>
          <div style={shimmerStyle}></div>
        </div>

        {/* Filter Skeleton */}
        <div style={filterSkeletonStyle}>
          <div style={shimmerStyle}></div>
        </div>

        {/* Cards Grid Skeleton */}
        <div style={gridStyle}>
          {[1, 2, 3, 4].map((item) => (
            <div key={item} style={cardSkeletonStyle}>
              <div style={shimmerStyle}></div>
            </div>
          ))}
        </div>

        {/* Table Header Skeleton */}
        <div style={tableHeaderStyle}>
          <div style={shimmerStyle}></div>
        </div>

        {/* Table Rows Skeleton */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((item) => (
          <div key={item} style={tableRowStyle}>
            <div style={shimmerStyle}></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SkeletonLoader;
