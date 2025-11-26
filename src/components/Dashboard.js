import React, { useState, useEffect } from 'react';
import DriverRow from './DriverRow';
import RaceMap from './RaceMap';
import RaceInfo from './RaceInfo';
import WeatherWidget from './WeatherWidget';
import TeamRadio from './TeamRadio';
import RaceControl from './RaceControl';
import NoSessionModal from './NoSessionModal';
import SessionFilter from './SessionFilter';
import SkeletonLoader from './SkeletonLoader';
import DriverComparison from './DriverComparison';
import BlockVisibilityMenu from './BlockVisibilityMenu';
import { getFullRaceData, checkActiveSession, getUpcomingSessions, getAllLaps } from '../services/api';

// Estilos globais para scroll da tabela
const tableScrollStyles = `
  .table-scroll-container::-webkit-scrollbar {
    height: 8px;
  }
  
  .table-scroll-container::-webkit-scrollbar-track {
    background: #15151f;
    border-radius: 4px;
  }
  
  .table-scroll-container::-webkit-scrollbar-thumb {
    background: #e10600;
    border-radius: 4px;
  }
  
  .table-scroll-container::-webkit-scrollbar-thumb:hover {
    background: #ff0800;
  }
  
  @media (max-width: 768px) {
    .table-scroll-container {
      cursor: grab;
    }
    
    .table-scroll-container:active {
      cursor: grabbing;
    }
  }
`;

const Dashboard = () => {
  const [raceData, setRaceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [locations, setLocations] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [session, setSession] = useState(null);
  const [weather, setWeather] = useState([]);
  const [teamRadio, setTeamRadio] = useState([]);
  const [raceControl, setRaceControl] = useState([]);
  const [showNoSessionModal, setShowNoSessionModal] = useState(false);
  const [nextSession, setNextSession] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [isActiveSession, setIsActiveSession] = useState(false);
  const [selectedSessionKey, setSelectedSessionKey] = useState(null);
  const [forceLoadData, setForceLoadData] = useState(false);
  const [isLoadingForced, setIsLoadingForced] = useState(false);
  const [showApiWarning, setShowApiWarning] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'leader', direction: 'asc' });
  const [dataReadiness, setDataReadiness] = useState({
    drivers: false,
    positions: false,
    laps: false,
    intervals: false,
    stints: false
  });
  const [visibleColumns, setVisibleColumns] = useState({
    position: true,
    driver: true,
    leader: true,
    tyre: true,
    bestLap: true,
    interval: true,
    lastLap: true,
    miniSectors: true,
    lastSector: true,
    pit: true,
    topSpeed: true
  });
  const [comparisonMode, setComparisonMode] = useState(false);
  const [allLapsData, setAllLapsData] = useState([]);
  const [visibleBlocks, setVisibleBlocks] = useState({
    sessionInfo: true,
    weatherMap: true,
    driverTable: true,
    columnControls: true,
    legend: true,
    communications: true
  });

  const fetchData = async (sessionKey = null, forceLoad = false) => {
    try {
      if (forceLoad) {
        setIsLoadingForced(true);
        setLoading(false); // Garantir que apenas o loading forçado seja exibido
      } else if (!isInitialLoad) {
        // Apenas mostrar loading se não for o carregamento inicial
        setLoading(true);
        setIsLoadingForced(false);
      }
      
      // Resetar estado de prontidão
      setDataReadiness({
        drivers: false,
        positions: false,
        laps: false,
        intervals: false,
        stints: false
      });
      
      const data = await getFullRaceData(sessionKey, forceLoad);
      
      // Verificar quais dados foram carregados
      const readiness = {
        drivers: data.drivers && data.drivers.length > 0,
        positions: data.positions && data.positions.length > 0,
        laps: data.laps && data.laps.length > 0,
        intervals: data.intervals && data.intervals.length > 0,
        stints: data.stints && data.stints.length > 0
      };
      
      setDataReadiness(readiness);
      
      // Só processar se tivermos pelo menos drivers
      if (readiness.drivers) {
        processRaceData(data);
        setLocations(data.locations);
        setDrivers(data.drivers);
        setSession(data.session);
        setWeather(data.weather);
        setTeamRadio(data.teamRadio);
        setRaceControl(data.raceControl);
        setLastUpdate(new Date().toLocaleTimeString());
      }
      
      // Aguardar um pouco para garantir que todos os dados sejam processados
      // antes de remover o loading
      if (forceLoad) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Marcar que o carregamento inicial foi concluído
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
      
      setLoading(false);
      setIsLoadingForced(false);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
      setLoading(false);
      setIsLoadingForced(false);
    }
  };

  const checkSession = async () => {
    try {
      const sessionStatus = await checkActiveSession();
      setIsActiveSession(sessionStatus.isActive);
      
      if (!sessionStatus.isActive && !selectedSessionKey) {
        // Se não há sessão ativa e nenhuma sessão foi selecionada manualmente
        setNextSession(sessionStatus.nextSession);
        const upcoming = await getUpcomingSessions(5);
        setUpcomingSessions(upcoming);
        // Não mostrar modal automaticamente, apenas carregar última corrida
        // setShowNoSessionModal(true);
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
    }
  };

  const handleSessionChange = (sessionKey, sessionInfo) => {
    setSelectedSessionKey(sessionKey);
    
    // Se o modo forçado estiver ativo, mostrar loading forçado
    if (forceLoadData) {
      setIsLoadingForced(true);
      setLoading(false); // Garantir que apenas o loading forçado seja exibido
    } else {
      setLoading(true);
      setIsLoadingForced(false);
    }
    
    fetchData(sessionKey, forceLoadData);
  };

  const handleForceLoadToggle = () => {
    const newForceLoad = !forceLoadData;
    setForceLoadData(newForceLoad);
    
    // Recarregar dados com a nova configuração
    if (newForceLoad) {
      setIsLoadingForced(true);
      setLoading(false); // Garantir que apenas o loading forçado seja exibido
      fetchData(selectedSessionKey, true);
    } else {
      // Se desativar, apenas atualizar o estado sem recarregar
      // O usuário pode clicar em "Aplicar Filtro" novamente se quiser recarregar
    }
  };

  const loadAllLapsForComparison = async () => {
    if (!selectedSessionKey && !session?.session_key) {
      console.warn('Nenhuma sessão disponível para carregar voltas');
      return;
    }
    
    const sessionKey = selectedSessionKey || session?.session_key;
    try {
      const laps = await getAllLaps(sessionKey);
      setAllLapsData(laps);
    } catch (error) {
      console.error('Erro ao carregar voltas para comparação:', error);
      setAllLapsData([]);
    }
  };

  const toggleComparisonMode = () => {
    const newMode = !comparisonMode;
    setComparisonMode(newMode);
    
    // Se estiver ativando o modo comparação, carregar todas as voltas
    if (newMode && allLapsData.length === 0) {
      loadAllLapsForComparison();
    }
  };

  useEffect(() => {
    checkSession(); // Verificar se há sessão ativa primeiro
    fetchData(selectedSessionKey, forceLoadData);
    
    // Atualização automática apenas se não houver sessão selecionada manualmente
    let interval;
    if (!selectedSessionKey) {
      interval = setInterval(() => fetchData(null, forceLoadData), 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSessionKey]);

  const processRaceData = (data) => {
    const { drivers, positions = [], laps = [], intervals = [], pitStops = [], stints = [], classification = [] } = data;

    // Validação: precisamos de pelo menos drivers
    if (!drivers || drivers.length === 0) {
      console.warn('Nenhum dado de drivers disponível');
      setRaceData([]);
      return;
    }

    // Criar um mapa de pilotos únicos
    const driverMap = new Map();

    drivers.forEach(driver => {
      if (!driverMap.has(driver.driver_number)) {
        driverMap.set(driver.driver_number, driver);
      }
    });

    // Criar mapa de classificação final (se disponível)
    const classificationMap = {};
    if (classification && classification.length > 0) {
      classification.forEach(c => {
        classificationMap[c.driver_number] = c;
      });
      console.log('📋 Usando classificação final com', classification.length, 'pilotos');
    }

    // Processar posições finais (última posição registrada de cada piloto)
    const latestPositions = {};
    if (positions && positions.length > 0) {
      positions.forEach(pos => {
        const driverNum = pos.driver_number;
        // Pegar a última posição registrada (mais recente)
        if (!latestPositions[driverNum] || new Date(pos.date) > new Date(latestPositions[driverNum].date)) {
          latestPositions[driverNum] = pos;
        }
      });
      console.log(`📊 Posições finais processadas para ${Object.keys(latestPositions).length} pilotos`);
    }

    // Processar voltas mais recentes (com fallback)
    const latestLaps = {};
    if (laps && laps.length > 0) {
      laps.forEach(lap => {
        const driverNum = lap.driver_number;
        if (!latestLaps[driverNum] || lap.lap_number > latestLaps[driverNum].lap_number) {
          latestLaps[driverNum] = lap;
        }
      });
    }

    // Processar intervalos mais recentes (com fallback)
    const latestIntervals = {};
    if (intervals && intervals.length > 0) {
      intervals.forEach(interval => {
        const driverNum = interval.driver_number;
        if (!latestIntervals[driverNum] || new Date(interval.date) > new Date(latestIntervals[driverNum].date)) {
          latestIntervals[driverNum] = interval;
        }
      });
    }

    // Encontrar a melhor volta de cada piloto (com fallback)
    const bestLaps = {};
    if (laps && laps.length > 0) {
      laps.forEach(lap => {
        const driverNum = lap.driver_number;
        if (lap.lap_duration && (!bestLaps[driverNum] || lap.lap_duration < bestLaps[driverNum].lap_duration)) {
          bestLaps[driverNum] = lap;
        }
      });
    }

    // Contar pit stops por piloto (com fallback)
    const pitStopCounts = {};
    if (pitStops && pitStops.length > 0) {
      pitStops.forEach(pit => {
        const driverNum = pit.driver_number;
        pitStopCounts[driverNum] = (pitStopCounts[driverNum] || 0) + 1;
      });
    }

    // Obter stint atual (pneu atual) (com fallback)
    const currentStints = {};
    if (stints && stints.length > 0) {
      stints.forEach(stint => {
        const driverNum = stint.driver_number;
        if (!currentStints[driverNum] || stint.stint_number > currentStints[driverNum].stint_number) {
          currentStints[driverNum] = stint;
        }
      });
    }

    // Combinar todos os dados
    const processedData = Array.from(driverMap.values()).map(driver => {
      const driverNum = driver.driver_number;
      const position = latestPositions[driverNum];
      const lap = latestLaps[driverNum];
      const bestLap = bestLaps[driverNum];
      const interval = latestIntervals[driverNum];
      const currentStint = currentStints[driverNum];

      // Converter segmentos da API para mini setores
      const segments = [
        ...(lap?.segments_sector_1 || []),
        ...(lap?.segments_sector_2 || []),
        ...(lap?.segments_sector_3 || [])
      ];

      const sectors = segments.length > 0 ? segments.map(seg => ({
        value: seg,
        isBest: seg === 2051, // purple sector
        isPersonalBest: seg === 2049, // green sector
        isYellow: seg === 2048 // yellow sector
      })) : [];

      // Determinar status do piloto baseado na classificação ou voltas
      const totalLaps = lap?.lap_number || 0;
      let status = 'CLASSIFIED';
      let displayPosition = classificationMap[driverNum]?.displayPosition || position?.position || 999;
      
      if (classificationMap[driverNum]) {
        status = classificationMap[driverNum].status;
        displayPosition = classificationMap[driverNum].displayPosition;
      } else if (totalLaps < 45 && totalLaps > 0) {
        status = 'DNF';
        displayPosition = 'NC';
      } else if (totalLaps === 0) {
        status = 'DNF';
        displayPosition = 'NC';
      }

      return {
        position: classificationMap[driverNum]?.position || position?.position || 999,
        displayPosition: displayPosition, // Posição para exibição (pode ser "NC", "DQ")
        driverNumber: driverNum,
        driver: driver.name_acronym || driver.full_name || 'N/A',
        teamName: driver.team_name || 'N/A',
        teamColor: driver.team_colour || 'FFFFFF',
        leader: interval?.gap_to_leader === null || interval?.gap_to_leader === 0 ? 'LEADER' : 
                (typeof interval?.gap_to_leader === 'string' ? interval.gap_to_leader : 
                 interval?.gap_to_leader ? `+${interval.gap_to_leader.toFixed(3)}` : '-'),
        leaderGap: interval?.gap_to_leader === null || interval?.gap_to_leader === 0 ? 0 : 
                   (typeof interval?.gap_to_leader === 'number' ? interval.gap_to_leader : 999999),
        tyre: currentStint?.compound || 'SOFT',
        bestLap: bestLap?.lap_duration ? formatLapTime(bestLap.lap_duration) : '-',
        lapNumber: totalLaps,
        interval: interval?.interval || '-',
        lastLap: lap?.lap_duration ? formatLapTime(lap.lap_duration) : '-',
        miniSectors: sectors,
        lastSector: lap?.duration_sector_3 ? lap.duration_sector_3.toFixed(3) : '-',
        pit: pitStopCounts[driverNum] || 0,
        topSpeed: lap?.st_speed || '-',
        sector1: lap?.duration_sector_1 ? lap.duration_sector_1.toFixed(3) : '-',
        sector2: lap?.duration_sector_2 ? lap.duration_sector_2.toFixed(3) : '-',
        sector3: lap?.duration_sector_3 ? lap.duration_sector_3.toFixed(3) : '-',
        status: status,
        finished: status === 'CLASSIFIED'
      };
    });

    // Ordenar pela posição (já calculada pela classificação final ou API)
    processedData.sort((a, b) => {
      // Pilotos sem posição (999) vão para o final
      if (a.position === 999 && b.position !== 999) return 1;
      if (a.position !== 999 && b.position === 999) return -1;
      if (a.position === 999 && b.position === 999) {
        // Entre pilotos sem posição, ordenar por voltas completadas
        if (b.lapNumber !== a.lapNumber) return b.lapNumber - a.lapNumber;
        return a.driverNumber - b.driverNumber;
      }
      
      // Ordenar por posição (menor = melhor)
      return a.position - b.position;
    });
    
    console.log('🏁 Classificação final:', processedData.slice(0, 15).map(d => {
      const pos = typeof d.displayPosition === 'number' ? `P${d.displayPosition}` : d.displayPosition;
      return `${pos}: #${d.driverNumber} ${d.driver} (${d.lapNumber} voltas) - ${d.status}`;
    }));

    setRaceData(processedData);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...raceData].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      // Tratamento especial para coluna Leader
      if (key === 'leader') {
        // Usar o campo numérico leaderGap para ordenação
        const aGap = a.leaderGap;
        const bGap = b.leaderGap;
        
        // Pilotos sem dados (999999) vão para o final
        if (aGap === 999999 && bGap === 999999) return 0;
        if (aGap === 999999) return 1;
        if (bGap === 999999) return -1;
        
        // Ordenação numérica do gap
        return direction === 'asc' ? aGap - bGap : bGap - aGap;
      }

      // Tratamento especial para diferentes tipos de dados
      if (key === 'position') {
        // Ordenação numérica simples por posição
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (key === 'driver' || key === 'teamName') {
        // Ordenação alfabética
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (key === 'bestLap' || key === 'lastLap') {
        // Ordenação de tempo (formato "M:SS.SSS")
        if (aValue === '-' && bValue === '-') return 0;
        if (aValue === '-') return 1;
        if (bValue === '-') return -1;
        
        const parseTime = (time) => {
          const [min, sec] = time.split(':');
          return parseFloat(min) * 60 + parseFloat(sec);
        };
        
        const aTime = parseTime(aValue);
        const bTime = parseTime(bValue);
        return direction === 'asc' ? aTime - bTime : bTime - aTime;
      }

      if (key === 'topSpeed') {
        // Ordenação numérica
        if (aValue === '-' && bValue === '-') return 0;
        if (aValue === '-') return 1;
        if (bValue === '-') return -1;
        
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        return direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Ordenação numérica padrão
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Ordenação de string padrão
      return direction === 'asc' 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    setRaceData(sortedData);
  };

  const formatLapTime = (duration) => {
    if (!duration) return '-';
    const totalSeconds = duration;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(3);
    return `${minutes}:${seconds.padStart(6, '0')}`;
  };

  const toggleColumn = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const toggleBlock = (block) => {
    setVisibleBlocks(prev => ({
      ...prev,
      [block]: !prev[block]
    }));
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '1800px',
    margin: '0 auto',
    backgroundColor: '#0d0d15',
    '@media (max-width: 768px)': {
      padding: '10px'
    }
  };

  const headerStyle = {
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#e10600',
    borderRadius: '8px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px'
  };

  const updateStyle = {
    fontSize: '14px',
    color: '#ffffff',
    opacity: 0.9
  };

  const mainGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
    marginBottom: '20px'
  };

  const sideGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  };

  const eventGridStyle = {
    display: 'grid',
    gap: '20px',
    marginBottom: '20px'
  };

  const tableHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#15151f',
    fontWeight: 'bold',
    fontSize: '11px',
    textTransform: 'uppercase',
    color: '#9ca3af',
    borderRadius: '8px 8px 0 0',
    borderBottom: '2px solid #2a2a3e'
  };

  const sortableHeaderStyle = {
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'color 0.2s, background-color 0.2s',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return '⇅'; // Ícone de ordenação neutra
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const tableStyle = {
    backgroundColor: '#0d0d15',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
  };

  const tableScrollContainerStyle = {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'thin',
    scrollbarColor: '#e10600 #15151f'
  };

  const sectionTitleStyle = {
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '15px',
    marginTop: '10px'
  };

  // Durante o carregamento inicial, não mostrar loading de tela cheia
  if (isInitialLoad) {
    return (
      <div style={containerStyle}>
        <style>{tableScrollStyles}</style>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            🏎️ F1 Dashboard Completo - Live Race
          </h1>
          <p style={updateStyle}>Carregando dados iniciais...</p>
        </div>
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#9ca3af',
          fontSize: '16px'
        }}>
          <div style={{ marginBottom: '20px', fontSize: '48px' }}>⏳</div>
          <div>Aguarde, carregando informações da última corrida...</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <SkeletonLoader />;
  }

  if (isLoadingForced) {
    return <SkeletonLoader 
      isForced={true} 
      message="⏳ Carregando 9 endpoints com delays de 3s entre cada um. Isso pode levar até 30 segundos..."
    />;
  }

  return (
    <div style={containerStyle}>
      <style>{tableScrollStyles}</style>
      {showNoSessionModal && (
        <NoSessionModal 
          nextSession={nextSession}
          upcomingSessions={upcomingSessions}
          onClose={() => setShowNoSessionModal(false)}
        />
      )}

      {/* Menu de Visibilidade dos Blocos */}
      <BlockVisibilityMenu 
        visibleBlocks={visibleBlocks}
        onToggleBlock={toggleBlock}
      />

      <div style={headerStyle}>
        <h1 style={titleStyle}>
          🏎️ F1 Dashboard Completo - Live Race
          {!isActiveSession && !selectedSessionKey && (
            <span style={{fontSize: '14px', marginLeft: '15px', color: '#fbbf24', fontWeight: 'normal'}}>
              📡 Exibindo última corrida válida
            </span>
          )}
          {isActiveSession && !selectedSessionKey && (
            <span style={{fontSize: '14px', marginLeft: '15px', color: '#22c55e', fontWeight: 'normal'}}>
              🔴 AO VIVO
            </span>
          )}
          {selectedSessionKey && (
            <span style={{fontSize: '14px', marginLeft: '15px', color: '#3b82f6', fontWeight: 'normal'}}>
              🔍 Sessão Filtrada
            </span>
          )}
        </h1>
        <p style={updateStyle}>Última atualização: {lastUpdate}</p>
        {session && (
          <p style={{...updateStyle, marginTop: '5px', fontSize: '13px'}}>
            📍 {session.country_name} - {session.circuit_short_name} | 
            📅 {new Date(session.date_start).toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>

      {/* Aviso sobre limitações da API */}
      {showApiWarning && (
        <div style={{
          backgroundColor: '#fbbf24',
          color: '#000000',
          padding: '15px 20px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: '1.6',
          border: '2px solid #f59e0b',
          position: 'relative'
        }}>
          <button
            onClick={() => setShowApiWarning(false)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#000000',
              fontWeight: 'bold',
              padding: '5px 10px',
              borderRadius: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.1)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            title="Fechar aviso"
          >
            ✕
          </button>
          <div style={{fontWeight: 'bold', marginBottom: '5px', fontSize: '16px'}}>
            ⚠️ Aviso: Limitações da API OpenF1
          </div>
          <div>
            Sessões históricas contêm milhões de registros que excedem os limites da API gratuita 
            (3 req/s e 4MB/10s). Atualmente, apenas informações básicas dos pilotos estão disponíveis.
            <br/>
            <strong>Use o botão "🚀 Tentar Forçar" abaixo para carregar dados completos (pode demorar ~30s).</strong>
          </div>
        </div>
      )}

      {/* Opção para forçar carregamento de dados */}
      <div style={{
        backgroundColor: forceLoadData ? '#22c55e' : '#15151f',
        color: '#ffffff',
        padding: '15px 20px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: forceLoadData ? '2px solid #16a34a' : '2px solid #2a2a3e'
      }}>
        <div>
          <div style={{fontWeight: 'bold', marginBottom: '5px', fontSize: '16px'}}>
            {forceLoadData ? '✅ Modo Forçado ATIVO' : '🔒 Modo Conservador'}
          </div>
          <div style={{fontSize: '13px', opacity: 0.9, lineHeight: '1.5'}}>
            {forceLoadData 
              ? (isLoadingForced 
                  ? '⏳ Carregando todos os endpoints (9 no total) com delays de 3s entre cada um...'
                  : 'Dados completos carregados! Inclui: Drivers, Laps, Intervals, Positions, Stints, Team Radio, Weather, Location e Race Control.')
              : 'Apenas dados essenciais (Drivers) para evitar erros da API'
            }
            {isLoadingForced && (
              <div style={{marginTop: '8px', fontSize: '12px', color: '#fbbf24'}}>
                💡 Acompanhe o progresso detalhado no Console do navegador (F12)
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleForceLoadToggle}
          disabled={isLoadingForced}
          style={{
            backgroundColor: forceLoadData ? '#dc2626' : '#3b82f6',
            color: '#ffffff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: isLoadingForced ? 'not-allowed' : 'pointer',
            opacity: isLoadingForced ? 0.6 : 1,
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => !isLoadingForced && (e.target.style.opacity = '0.9')}
          onMouseOut={(e) => !isLoadingForced && (e.target.style.opacity = '1')}
        >
          {isLoadingForced ? '⏳ Carregando...' : (forceLoadData ? '🔒 Desativar' : '🚀 Tentar Forçar')}
        </button>
      </div>

      {/* Filtro de Sessões */}
      <SessionFilter 
        onSessionChange={handleSessionChange}
        currentSession={session}
      />

      {/* Toggle para Modo Comparação */}
      <div style={{
        backgroundColor: comparisonMode ? '#3b82f6' : '#15151f',
        color: '#ffffff',
        padding: '15px 20px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: comparisonMode ? '2px solid #2563eb' : '2px solid #2a2a3e'
      }}>
        <div>
          <div style={{fontWeight: 'bold', marginBottom: '5px', fontSize: '16px'}}>
            {comparisonMode ? '⚔️ Modo Comparação ATIVO' : '📊 Modo Dashboard Padrão'}
          </div>
          <div style={{fontSize: '13px', opacity: 0.9, lineHeight: '1.5'}}>
            {comparisonMode 
              ? 'Compare estatísticas detalhadas de dois pilotos lado a lado'
              : 'Visualize classificação completa e informações da corrida'
            }
          </div>
        </div>
        <button
          onClick={toggleComparisonMode}
          style={{
            backgroundColor: comparisonMode ? '#dc2626' : '#3b82f6',
            color: '#ffffff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.9'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          {comparisonMode ? '📊 Ver Dashboard' : '⚔️ Comparar Pilotos'}
        </button>
      </div>

      {/* Indicador de Status dos Dados */}
      <div style={{
        backgroundColor: '#15151f',
        color: '#ffffff',
        padding: '15px 20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '2px solid #2a2a3e'
      }}>
        <div style={{fontWeight: 'bold', marginBottom: '10px', fontSize: '16px'}}>
          📊 Status dos Dados Carregados
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px',
          fontSize: '13px'
        }}>
          <div style={{
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: dataReadiness.drivers ? '#22c55e20' : '#ef444420',
            border: `1px solid ${dataReadiness.drivers ? '#22c55e' : '#ef4444'}`
          }}>
            {dataReadiness.drivers ? '✅' : '❌'} Drivers
          </div>
          <div style={{
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: dataReadiness.positions ? '#22c55e20' : '#ef444420',
            border: `1px solid ${dataReadiness.positions ? '#22c55e' : '#ef4444'}`
          }}>
            {dataReadiness.positions ? '✅' : '❌'} Positions
          </div>
          <div style={{
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: dataReadiness.laps ? '#22c55e20' : '#ef444420',
            border: `1px solid ${dataReadiness.laps ? '#22c55e' : '#ef4444'}`
          }}>
            {dataReadiness.laps ? '✅' : '❌'} Laps
          </div>
          <div style={{
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: dataReadiness.intervals ? '#22c55e20' : '#ef444420',
            border: `1px solid ${dataReadiness.intervals ? '#22c55e' : '#ef4444'}`
          }}>
            {dataReadiness.intervals ? '✅' : '❌'} Intervals
          </div>
          <div style={{
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: dataReadiness.stints ? '#22c55e20' : '#ef444420',
            border: `1px solid ${dataReadiness.stints ? '#22c55e' : '#ef4444'}`
          }}>
            {dataReadiness.stints ? '✅' : '❌'} Stints
          </div>
        </div>
        {(!dataReadiness.positions || !dataReadiness.laps || !dataReadiness.intervals || !dataReadiness.stints) && (
          <div style={{
            marginTop: '12px',
            padding: '10px',
            borderRadius: '6px',
            backgroundColor: '#fbbf2420',
            border: '1px solid #fbbf24',
            fontSize: '12px'
          }}>
            ⚠️ Alguns dados estão faltando. Use o <strong>Modo Forçado</strong> acima para carregar dados completos.
          </div>
        )}
      </div>

      {/* Informações da Sessão */}
      {visibleBlocks.sessionInfo && (
        <div style={mainGridStyle}>
          <RaceInfo session={session} />
        </div>
      )}

      {/* Modo Comparação ou Dashboard Normal */}
      {comparisonMode ? (
        <DriverComparison 
          raceData={raceData}
          sessionKey={selectedSessionKey || session?.session_key}
          lapsData={allLapsData}
        />
      ) : (
        <>
          {/* Clima e Mapa */}
          {visibleBlocks.weatherMap && (
            <div style={sideGridStyle}>
              <WeatherWidget weather={weather} />
              <RaceMap locations={locations} drivers={drivers} />
            </div>
          )}

          {/* Tabela de Posições */}
          {visibleBlocks.driverTable && (
            <>
              <h2 style={sectionTitleStyle}>📊 Classificação ao Vivo</h2>
      
              {/* Controle de Visibilidade de Colunas */}
              {visibleBlocks.columnControls && (
                <div style={{
        backgroundColor: '#15151f',
        padding: '15px 20px',
        borderRadius: '8px 8px 0 0',
        marginBottom: '-8px',
        border: '2px solid #2a2a3e',
        borderBottom: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#9ca3af', marginRight: '10px' }}>
            Mostrar/Ocultar Colunas:
          </span>
          {Object.entries({
            leader: 'Gap/Leader',
            tyre: 'Pneu',
            bestLap: 'Melhor Volta',
            interval: 'Intervalo',
            lastLap: 'Última Volta',
            miniSectors: 'Mini Setores',
            lastSector: 'Último Setor',
            pit: 'Pit',
            topSpeed: 'Velocidade'
          }).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleColumn(key)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: visibleColumns[key] ? '#22c55e' : '#374151',
                color: '#ffffff',
                transition: 'all 0.2s',
                opacity: visibleColumns[key] ? 1 : 0.5
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              {visibleColumns[key] ? '✓' : '✗'} {label}
            </button>
          ))}
        </div>
      </div>
              )}

      <div style={tableStyle}>
        <div className="table-scroll-container" style={tableScrollContainerStyle}>
          <div style={{ minWidth: 'max-content' }}>
            <div style={tableHeaderStyle}>
          {visibleColumns.position && (
            <div 
              style={{ width: '35px', textAlign: 'center', ...sortableHeaderStyle }}
              onClick={() => handleSort('position')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a3e'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Ordenar por posição"
            >
              # {getSortIcon('position')}
            </div>
          )}
          {visibleColumns.driver && (
            <div 
              style={{ width: '100px', ...sortableHeaderStyle }}
              onClick={() => handleSort('driver')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a3e'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Ordenar por piloto"
            >
              Driver {getSortIcon('driver')}
            </div>
          )}
          {visibleColumns.leader && <div style={{ width: '90px' }}>Leader</div>}
          {visibleColumns.tyre && (
            <div 
              style={{ width: '60px', ...sortableHeaderStyle }}
              onClick={() => handleSort('tyre')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a3e'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Ordenar por pneu"
            >
              Tyre {getSortIcon('tyre')}
            </div>
          )}
          {visibleColumns.bestLap && (
            <div 
              style={{ width: '90px', ...sortableHeaderStyle }}
              onClick={() => handleSort('bestLap')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a3e'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Ordenar por melhor volta"
            >
              Best lap {getSortIcon('bestLap')}
            </div>
          )}
          {visibleColumns.interval && <div style={{ width: '90px' }}>Interval</div>}
          {visibleColumns.lastLap && (
            <div 
              style={{ width: '90px', ...sortableHeaderStyle }}
              onClick={() => handleSort('lastLap')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a3e'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Ordenar por última volta"
            >
              Last lap {getSortIcon('lastLap')}
            </div>
          )}
          {visibleColumns.miniSectors && <div style={{ flex: 1, minWidth: '200px' }}>Mini sectors</div>}
          {visibleColumns.lastSector && <div style={{ width: '90px' }}>Last sector</div>}
          {visibleColumns.pit && (
            <div 
              style={{ width: '50px', textAlign: 'center', ...sortableHeaderStyle }}
              onClick={() => handleSort('pit')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a3e'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Ordenar por pit stops"
            >
              PIT {getSortIcon('pit')}
            </div>
          )}
          {visibleColumns.topSpeed && (
            <div 
              style={{ width: '70px', ...sortableHeaderStyle }}
              onClick={() => handleSort('topSpeed')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a3e'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Ordenar por velocidade"
            >
              Top Sp. {getSortIcon('topSpeed')}
            </div>
          )}
        </div>

        {raceData.length > 0 ? (
          raceData.map((driver, index) => (
            <DriverRow key={index} {...driver} visibleColumns={visibleColumns} />
          ))
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
            Nenhum dado disponível. Aguarde uma corrida ao vivo ou verifique a API.
          </div>
        )}
          </div>
        </div>
      </div>

              {/* Legenda - Mini Setores e Pneus */}
              {visibleBlocks.legend && (
                <div style={{
        backgroundColor: '#15151f',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '15px',
        border: '2px solid #2a2a3e'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {/* Legenda Mini Setores */}
          <div>
            <h4 style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📊 Mini Setores
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#a855f7',
                  borderRadius: '4px',
                  border: '2px solid #a855f7'
                }}></div>
                <span style={{ color: '#e5e7eb', fontSize: '13px' }}>
                  Roxo - Melhor setor da sessão (geral)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#22c55e',
                  borderRadius: '4px',
                  border: '2px solid #22c55e'
                }}></div>
                <span style={{ color: '#e5e7eb', fontSize: '13px' }}>
                  Verde - Melhor setor pessoal do piloto
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#fbbf24',
                  borderRadius: '4px',
                  border: '2px solid #fbbf24'
                }}></div>
                <span style={{ color: '#e5e7eb', fontSize: '13px' }}>
                  Amarelo - Setor mais lento que o pessoal
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: 'transparent',
                  borderRadius: '4px',
                  border: '2px solid #4b5563'
                }}></div>
                <span style={{ color: '#e5e7eb', fontSize: '13px' }}>
                  Cinza - Setor normal
                </span>
              </div>
            </div>
          </div>

          {/* Legenda Tipos de Pneu */}
          <div>
            <h4 style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              🏎️ Tipos de Pneu
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  border: '2px solid #ef4444'
                }}></div>
                <span style={{ color: '#e5e7eb', fontSize: '13px' }}>
                  Vermelho - SOFT (Macio)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#fbbf24',
                  borderRadius: '50%',
                  border: '2px solid #fbbf24'
                }}></div>
                <span style={{ color: '#e5e7eb', fontSize: '13px' }}>
                  Amarelo - MEDIUM (Médio)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '50%',
                  border: '2px solid #e5e7eb'
                }}></div>
                <span style={{ color: '#e5e7eb', fontSize: '13px' }}>
                  Branco - HARD (Duro)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#22c55e',
                  borderRadius: '50%',
                  border: '2px solid #22c55e'
                }}></div>
                <span style={{ color: '#e5e7eb', fontSize: '13px' }}>
                  Verde - INTERMEDIATE (Chuva leve)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  border: '2px solid #3b82f6'
                }}></div>
                <span style={{ color: '#e5e7eb', fontSize: '13px' }}>
                  Azul - WET (Chuva pesada)
                </span>
              </div>
            </div>
          </div>

          {/* Legenda Status dos Pilotos */}
          <div>
            <h4 style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              🏁 Status da Corrida
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '20px',
                  backgroundColor: '#374151',
                  borderRadius: '4px',
                  border: '2px solid #4b5563',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#ffffff'
                }}>1-20</div>
                <span style={{ color: '#e5e7eb', fontSize: '13px' }}>
                  Posição numérica - Piloto classificado
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '20px',
                  backgroundColor: '#374151',
                  borderRadius: '4px',
                  border: '2px solid #fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#fbbf24'
                }}>NC</div>
                <span style={{ color: '#e5e7eb', fontSize: '13px' }}>
                  Not Classified - Não classificado (DNF)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '20px',
                  backgroundColor: '#374151',
                  borderRadius: '4px',
                  border: '2px solid #ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#ef4444'
                }}>DQ</div>
                <span style={{ color: '#e5e7eb', fontSize: '13px' }}>
                  Disqualified - Desqualificado
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '20px',
                  backgroundColor: '#374151',
                  borderRadius: '4px',
                  border: '2px solid #fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  color: '#fbbf24'
                }}>DNF</div>
                <span style={{ color: '#e5e7eb', fontSize: '13px' }}>
                  Did Not Finish - Não completou a corrida
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '20px',
                  backgroundColor: '#374151',
                  borderRadius: '4px',
                  border: '2px solid #ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  color: '#ef4444'
                }}>DSQ</div>
                <span style={{ color: '#e5e7eb', fontSize: '13px' }}>
                  Disqualified - Desqualificado (mesma sigla)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
              )}
            </>
          )}

      {/* Rádio e Controle da Corrida */}
      {visibleBlocks.communications && (
        <>
          <h2 style={sectionTitleStyle}>📡 Comunicações e Eventos</h2>
          <div style={eventGridStyle}>
            <TeamRadio teamRadio={teamRadio} drivers={drivers} />
            <RaceControl raceControl={raceControl} drivers={drivers} />
          </div>
        </>
      )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
