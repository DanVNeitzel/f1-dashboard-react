import axios from 'axios';

const BASE_URL = 'https://api.openf1.org/v1';

// Função auxiliar para adicionar delay entre requisições (respeitar rate limit da API)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Rate limiter - máximo 3 requisições por segundo
let requestQueue = [];
let isProcessing = false;

const rateLimitedRequest = async (requestFn) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ requestFn, resolve, reject });
    processQueue();
  });
};

const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  const batch = requestQueue.splice(0, 3); // Processar até 3 por vez
  
  try {
    const results = await Promise.all(
      batch.map(({ requestFn, resolve, reject }) =>
        requestFn().then(resolve).catch(reject)
      )
    );
    
    if (requestQueue.length > 0) {
      await delay(1000); // Aguardar 1 segundo antes do próximo lote
      isProcessing = false;
      processQueue();
    } else {
      isProcessing = false;
    }
  } catch (error) {
    isProcessing = false;
    throw error;
  }
};

// Função para obter a última sessão ativa
export const getLatestSession = async () => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    
    // Buscar todas as corridas do ano atual
    const response = await axios.get(`${BASE_URL}/sessions?session_name=Race&year=${year}`);
    const sessions = response.data;
    
    if (sessions.length === 0) {
      return null;
    }
    
    // Filtrar sessões que já aconteceram (data_end anterior à data atual)
    const pastSessions = sessions.filter(session => {
      const endDate = new Date(session.date_end);
      return endDate <= now;
    });
    
    // Se houver sessões passadas, retornar a mais recente
    if (pastSessions.length > 0) {
      const latestPastSession = pastSessions.sort((a, b) => 
        new Date(b.date_end) - new Date(a.date_end)
      )[0];
      console.log('📅 Última corrida válida:', latestPastSession.country_name, latestPastSession.date_end);
      return latestPastSession;
    }
    
    // Se não há sessões passadas, retornar a primeira futura (caso estejamos no início da temporada)
    const futureSessions = sessions.filter(session => {
      const startDate = new Date(session.date_start);
      return startDate > now;
    });
    
    if (futureSessions.length > 0) {
      const nextSession = futureSessions.sort((a, b) => 
        new Date(a.date_start) - new Date(b.date_start)
      )[0];
      console.log('📅 Próxima corrida:', nextSession.country_name, nextSession.date_start);
      return nextSession;
    }
    
    // Fallback: retornar a última sessão disponível
    return sessions[sessions.length - 1];
  } catch (error) {
    console.error('Erro ao buscar sessão:', error);
    return null;
  }
};

// Função para verificar se há uma sessão ativa no momento
export const checkActiveSession = async () => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    
    // Buscar todas as sessões do ano atual
    const response = await axios.get(`${BASE_URL}/sessions?year=${year}`);
    const sessions = response.data;
    
    if (sessions.length === 0) {
      return { isActive: false, currentSession: null, nextSession: null };
    }
    
    // Verificar se há uma sessão acontecendo agora
    const activeSession = sessions.find(session => {
      const start = new Date(session.date_start);
      const end = new Date(session.date_end);
      return now >= start && now <= end;
    });
    
    if (activeSession) {
      return { isActive: true, currentSession: activeSession, nextSession: null };
    }
    
    // Se não há sessão ativa, encontrar a próxima
    const futureSessions = sessions.filter(session => new Date(session.date_start) > now);
    const nextSession = futureSessions.length > 0 ? futureSessions[0] : null;
    
    return { isActive: false, currentSession: null, nextSession };
  } catch (error) {
    console.error('Erro ao verificar sessão ativa:', error);
    return { isActive: false, currentSession: null, nextSession: null };
  }
};

// Função para obter as próximas sessões
export const getUpcomingSessions = async (limit = 5) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    
    const response = await axios.get(`${BASE_URL}/sessions?year=${year}`);
    const sessions = response.data;
    
    // Filtrar sessões futuras e ordenar por data
    const upcoming = sessions
      .filter(session => new Date(session.date_start) > now)
      .sort((a, b) => new Date(a.date_start) - new Date(b.date_start))
      .slice(0, limit);
    
    return upcoming;
  } catch (error) {
    console.error('Erro ao buscar próximas sessões:', error);
    return [];
  }
};

// Função para obter todas as sessões de um meeting específico
export const getMeetingSessions = async (meetingKey) => {
  try {
    const response = await axios.get(`${BASE_URL}/sessions?meeting_key=${meetingKey}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar sessões do meeting:', error);
    return [];
  }
};

// Função para obter todas as sessões de um ano
export const getSessionsByYear = async (year) => {
  try {
    const response = await axios.get(`${BASE_URL}/sessions?year=${year}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar sessões do ano:', error);
    return [];
  }
};

// Função para obter sessões por país e ano
export const getSessionsByCountry = async (year, countryName) => {
  try {
    const response = await axios.get(`${BASE_URL}/sessions?year=${year}&country_name=${countryName}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar sessões por país:', error);
    return [];
  }
};

// Função helper para buscar dados de sessão
const getSessionInfo = async (sessionKey) => {
  try {
    const response = await axios.get(`${BASE_URL}/sessions?session_key=${sessionKey}`);
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error('Erro ao buscar informações da sessão:', error);
    return null;
  }
};

// Função para obter classificação final baseada na última volta
export const getRaceClassification = async (sessionKey) => {
  try {
    console.log('🏁 Buscando classificação final da corrida...');
    
    // DSQ conhecidos (desqualificações pós-corrida não aparecem na API)
    // Las Vegas 2025 - Norris e Piastri desqualificados por infrações técnicas
    const knownDSQ = {
      9858: [4, 81] // session_key 9858: carros 4 (Norris) e 81 (Piastri)
    };
    
    const dsqDrivers = knownDSQ[sessionKey] || [];
    
    // Buscar todas as voltas
    const response = await axios.get(`${BASE_URL}/laps?session_key=${sessionKey}`);
    const allLaps = response.data;
    
    if (allLaps.length === 0) {
      console.warn('Nenhuma volta encontrada');
      return [];
    }
    
    // Encontrar o número máximo de voltas completadas
    const maxLapNumber = Math.max(...allLaps.map(lap => lap.lap_number));
    console.log(`📊 Corrida teve ${maxLapNumber} voltas`);
    
    // Pegar última volta de cada piloto
    const driverLastLaps = {};
    allLaps.forEach(lap => {
      const driverNum = lap.driver_number;
      if (!driverLastLaps[driverNum] || lap.lap_number > driverLastLaps[driverNum].lap_number) {
        driverLastLaps[driverNum] = lap;
      }
    });
    
    // Buscar todos os drivers da sessão para identificar quem não largou
    const driversResponse = await axios.get(`${BASE_URL}/drivers?session_key=${sessionKey}`);
    const allDrivers = driversResponse.data;
    
    // Separar pilotos que completaram a corrida, DNF, DSQ e DNS (não largaram)
    const finishers = [];
    const dnfDrivers = [];
    const dsqDriversList = [];
    const dnsDrivers = [];
    
    allDrivers.forEach(driver => {
      const lap = driverLastLaps[driver.driver_number];
      
      // Verificar se está na lista de DSQ
      if (dsqDrivers.includes(driver.driver_number)) {
        dsqDriversList.push({
          driver_number: driver.driver_number,
          lap_number: lap?.lap_number || 0,
          date_start: lap?.date_start || null,
          status: 'DSQ'
        });
      } else if (!lap || lap.lap_number === 0) {
        // Piloto não completou nenhuma volta - DNS ou DNF na largada
        dnsDrivers.push({
          driver_number: driver.driver_number,
          lap_number: 0,
          date_start: null,
          status: 'DNF'
        });
      } else if (lap.lap_number === maxLapNumber) {
        // Completou todas as voltas
        finishers.push({
          ...lap,
          status: 'CLASSIFIED'
        });
      } else {
        // DNF - não completou a corrida
        dnfDrivers.push({
          ...lap,
          status: 'DNF'
        });
      }
    });
    
    // Ordenar finishers pela ordem de chegada (date_start da última volta)
    finishers.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
    
    // Ordenar DNF por número de voltas completadas (decrescente), depois por data
    dnfDrivers.sort((a, b) => {
      if (b.lap_number !== a.lap_number) {
        return b.lap_number - a.lap_number;
      }
      if (a.date_start && b.date_start) {
        return new Date(b.date_start) - new Date(a.date_start);
      }
      return 0;
    });
    
    // DNS vão por último
    dnsDrivers.sort((a, b) => a.driver_number - b.driver_number);
    
    // DSQ ordenados por número do carro
    dsqDriversList.sort((a, b) => a.driver_number - b.driver_number);
    
    // Combinar classificação
    let position = 1;
    const classification = [];
    
    // Finishers recebem posições normais (1, 2, 3...)
    finishers.forEach(lap => {
      classification.push({
        position: position++,
        driver_number: lap.driver_number,
        lap_number: lap.lap_number,
        date_start: lap.date_start,
        status: 'CLASSIFIED',
        displayPosition: position - 1
      });
    });
    
    // DNF aparecem como "NC" (Not Classified) ou mantém posição numérica
    dnfDrivers.forEach(lap => {
      classification.push({
        position: position++,
        driver_number: lap.driver_number,
        lap_number: lap.lap_number,
        date_start: lap.date_start,
        status: 'DNF',
        displayPosition: 'NC'
      });
    });
    
    // DNS aparecem como "NC"
    dnsDrivers.forEach(lap => {
      classification.push({
        position: position++,
        driver_number: lap.driver_number,
        lap_number: lap.lap_number,
        date_start: lap.date_start,
        status: 'DNF',
        displayPosition: 'NC'
      });
    });
    
    // DSQ aparecem como "DQ" (Disqualified)
    dsqDriversList.forEach(lap => {
      classification.push({
        position: position++,
        driver_number: lap.driver_number,
        lap_number: lap.lap_number,
        date_start: lap.date_start,
        status: 'DSQ',
        displayPosition: 'DQ'
      });
    });
    
    console.log('🏆 Classificação final:');
    console.log('  Finishers:', finishers.length);
    console.log('  DNF:', dnfDrivers.length);
    console.log('  DNS:', dnsDrivers.length);
    console.log('  DSQ:', dsqDriversList.length);
    classification.slice(0, 25).forEach(c => {
      const pos = typeof c.displayPosition === 'number' ? `P${c.displayPosition}` : c.displayPosition;
      console.log(`  ${pos}: #${c.driver_number} - ${c.lap_number} voltas (${c.status})`);
    });
    
    return classification;
  } catch (error) {
    console.error('Erro ao buscar classificação:', error);
    return [];
  }
};

// Função para obter dados de posição dos pilotos (otimizado com limite)
export const getPositions = async (sessionKey) => {
  try {
    // Buscar informações da sessão
    const session = await getSessionInfo(sessionKey);
    
    if (!session || !session.date_end) {
      // Se não tem data_end (sessão ao vivo), buscar dados limitados
      const response = await axios.get(`${BASE_URL}/position?session_key=${sessionKey}`);
      const data = response.data;
      // Retornar apenas os últimos 500 registros
      return data.length > 500 ? data.slice(-500) : data;
    }
    
    // Para sessões finalizadas, buscar os últimos 10 segundos para ter posições finais
    const endDate = new Date(session.date_end);
    const startDate = new Date(endDate.getTime() - 10000); // Últimos 10 segundos
    
    console.log(`📍 Buscando posições finais dos últimos 10s da corrida...`);
    
    const response = await axios.get(
      `${BASE_URL}/position?session_key=${sessionKey}&date>=${startDate.toISOString().split('.')[0]}`
    );
    
    console.log(`✅ ${response.data.length} registros de posição retornados`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar posições:', error);
    return [];
  }
};

// Função para obter dados dos pilotos (sem modificação - é pequeno)
export const getDrivers = async (sessionKey) => {
  try {
    const response = await axios.get(`${BASE_URL}/drivers?session_key=${sessionKey}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar pilotos:', error);
    return [];
  }
};

// Função para obter dados de voltas (otimizado - apenas última volta de cada piloto)
export const getLaps = async (sessionKey) => {
  try {
    const response = await axios.get(`${BASE_URL}/laps?session_key=${sessionKey}`);
    const data = response.data;
    
    // Se houver muitos dados, pegar apenas as últimas voltas de cada piloto
    if (data.length > 100) {
      const latestLaps = {};
      data.forEach(lap => {
        const key = lap.driver_number;
        if (!latestLaps[key] || lap.lap_number > latestLaps[key].lap_number) {
          latestLaps[key] = lap;
        }
      });
      return Object.values(latestLaps);
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar voltas:', error);
    return [];
  }
};

// Função para obter TODAS as voltas (para comparação detalhada)
export const getAllLaps = async (sessionKey) => {
  try {
    console.log('📊 Buscando todas as voltas para comparação...');
    const response = await axios.get(`${BASE_URL}/laps?session_key=${sessionKey}`);
    console.log(`✅ ${response.data.length} voltas carregadas`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar todas as voltas:', error);
    return [];
  }
};

// Função para obter dados de intervalos (otimizado - apenas últimos registros)
export const getIntervals = async (sessionKey) => {
  try {
    const response = await axios.get(`${BASE_URL}/intervals?session_key=${sessionKey}`);
    const data = response.data;
    
    // Se houver muitos dados, pegar apenas os últimos intervalos de cada piloto
    if (data.length > 100) {
      const latestIntervals = {};
      data.forEach(interval => {
        const key = interval.driver_number;
        if (!latestIntervals[key] || new Date(interval.date) > new Date(latestIntervals[key].date)) {
          latestIntervals[key] = interval;
        }
      });
      return Object.values(latestIntervals);
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar intervalos:', error);
    return [];
  }
};

// Função para obter dados de pit stops (desabilitado - muitos dados)
export const getPitStops = async (sessionKey) => {
  try {
    // Endpoint /pit pode retornar mais de 4MB de dados
    // Desabilitado para evitar exceder o limite da API
    console.warn('Pit endpoint desabilitado - usando stints para informações de pneus');
    return [];
  } catch (error) {
    console.error('Erro ao buscar pit stops:', error);
    return [];
  }
};

// Função para obter dados de stints (períodos com o mesmo pneu) - otimizado
export const getStints = async (sessionKey) => {
  try {
    const response = await axios.get(`${BASE_URL}/stints?session_key=${sessionKey}`);
    const data = response.data;
    
    // Stints geralmente tem poucos dados, mas vamos garantir
    if (data.length > 200) {
      // Pegar apenas os stints mais recentes de cada piloto
      const latestStints = {};
      data.forEach(stint => {
        const key = stint.driver_number;
        if (!latestStints[key] || stint.stint_number > latestStints[key].stint_number) {
          latestStints[key] = stint;
        }
      });
      return Object.values(latestStints);
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar stints:', error);
    return [];
  }
};

// Função para obter dados de localização dos pilotos (apenas posições mais recentes)
export const getLocations = async (sessionKey) => {
  try {
    // Buscar informações da sessão para pegar data final
    const session = await getSessionInfo(sessionKey);
    
    if (!session) {
      console.warn('Sessão não encontrada para buscar locations');
      return [];
    }

    // Se a sessão não tem data_end, buscar apenas últimos 30 segundos
    const endDate = session.date_end ? new Date(session.date_end) : new Date();
    const startDate = new Date(endDate.getTime() - 30000); // Últimos 30 segundos
    
    console.log(`🗺️ Buscando locations dos últimos 30s (${startDate.toISOString()} até ${endDate.toISOString()})`);
    
    const response = await axios.get(
      `${BASE_URL}/location?session_key=${sessionKey}&date>=${startDate.toISOString().split('.')[0]}&date<=${endDate.toISOString().split('.')[0]}`
    );
    
    const locationData = response.data;
    
    // Pegar apenas a última posição de cada piloto
    const latestLocations = {};
    locationData.forEach(loc => {
      const key = loc.driver_number;
      if (!latestLocations[key] || new Date(loc.date) > new Date(latestLocations[key].date)) {
        latestLocations[key] = loc;
      }
    });
    
    const result = Object.values(latestLocations);
    console.log(`✅ Location carregado: ${result.length} pilotos (de ${locationData.length} registros)`);
    
    return result;
  } catch (error) {
    console.error('❌ Erro ao buscar localizações:', error.message);
    // Se ainda falhar, tentar buscar apenas últimos 10 segundos
    try {
      console.log('🔄 Tentando com janela de 10 segundos...');
      const session = await getSessionInfo(sessionKey);
      const endDate = session?.date_end ? new Date(session.date_end) : new Date();
      const startDate = new Date(endDate.getTime() - 10000); // Últimos 10 segundos
      
      const response = await axios.get(
        `${BASE_URL}/location?session_key=${sessionKey}&date>=${startDate.toISOString().split('.')[0]}&date<=${endDate.toISOString().split('.')[0]}`
      );
      
      const locationData = response.data;
      const latestLocations = {};
      locationData.forEach(loc => {
        const key = loc.driver_number;
        if (!latestLocations[key] || new Date(loc.date) > new Date(latestLocations[key].date)) {
          latestLocations[key] = loc;
        }
      });
      
      const result = Object.values(latestLocations);
      console.log(`✅ Location carregado (10s): ${result.length} pilotos`);
      return result;
    } catch (secondError) {
      console.warn('❌ Location endpoint falhou mesmo com janela reduzida - desabilitado');
      return [];
    }
  }
};

// Função para obter dados meteorológicos (desabilitado - muitos dados)
export const getWeather = async (sessionKey) => {
  try {
    // Endpoint /weather pode retornar mais de 4MB de dados históricos
    // Desabilitado para evitar exceder o limite da API
    console.warn('Weather endpoint desabilitado - muitos dados históricos');
    return [];
  } catch (error) {
    console.error('Erro ao buscar clima:', error);
    return [];
  }
};

// Função para obter rádio da equipe (otimizado - apenas últimas mensagens)
export const getTeamRadio = async (sessionKey) => {
  try {
    const response = await axios.get(`${BASE_URL}/team_radio?session_key=${sessionKey}`);
    const data = response.data;
    
    // Limitar a últimas 50 mensagens para evitar exceder 4MB
    if (data.length > 50) {
      return data.slice(-50);
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar rádio da equipe:', error);
    // Se exceder o limite de dados, retornar array vazio
    if (error.response && (error.response.status === 429 || error.response.status === 413)) {
      console.warn('Team radio endpoint excedeu limite - desabilitado');
    }
    return [];
  }
};

// Função para obter eventos de controle da corrida (desabilitado - muitos dados)
export const getRaceControl = async (sessionKey) => {
  try {
    // Endpoint /race_control pode retornar mais de 4MB de dados
    // Desabilitado para evitar exceder o limite da API
    console.warn('Race control endpoint desabilitado - muitos dados históricos');
    return [];
  } catch (error) {
    console.error('Erro ao buscar controle da corrida:', error);
    return [];
  }
};

// Função para obter dados de telemetria do carro
export const getCarData = async (sessionKey, driverNumber) => {
  try {
    const response = await axios.get(`${BASE_URL}/car_data?session_key=${sessionKey}&driver_number=${driverNumber}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do carro:', error);
    return [];
  }
};

// Função FORÇADA para tentar buscar últimos dados válidos (ignora limitações)
export const getSessionDataForced = async (sessionKey) => {
  try {
    if (!sessionKey) {
      return { 
        drivers: [], 
        positions: [], 
        laps: [], 
        intervals: [], 
        locations: [], 
        pitStops: [], 
        stints: [],
        weather: [],
        teamRadio: [],
        raceControl: [],
        session: null
      };
    }

    console.warn('🚀 MODO FORÇADO ATIVADO - Tentando buscar últimos dados válidos...');
    
    const results = {
      drivers: [],
      positions: [],
      laps: [],
      intervals: [],
      locations: [],
      pitStops: [],
      stints: [],
      weather: [],
      teamRadio: [],
      raceControl: [],
      session: null,
      classification: []
    };

    // Tentar buscar cada endpoint com timeout e tratamento de erro individual
    // Lote 1 - Drivers
    try {
      results.drivers = await getDrivers(sessionKey);
      console.log('✅ Drivers carregados:', results.drivers.length);
    } catch (e) {
      console.warn('❌ Erro ao carregar drivers:', e.message);
    }
    await delay(3000);

    // Lote 1.5 - Classificação final
    try {
      results.classification = await getRaceClassification(sessionKey);
      console.log('✅ Classificação carregada:', results.classification.length);
    } catch (e) {
      console.warn('❌ Erro ao carregar classificação:', e.message);
    }
    await delay(3000);

    // Lote 2 - Laps (apenas últimas voltas)
    try {
      results.laps = await getLaps(sessionKey);
      console.log('✅ Laps carregados:', results.laps.length);
    } catch (e) {
      console.warn('❌ Erro ao carregar laps:', e.message);
    }
    await delay(3000);

    // Lote 3 - Intervals (apenas últimos)
    try {
      results.intervals = await getIntervals(sessionKey);
      console.log('✅ Intervals carregados:', results.intervals.length);
    } catch (e) {
      console.warn('❌ Erro ao carregar intervals:', e.message);
    }
    await delay(3000);

    // Lote 4 - Positions (apenas últimos)
    try {
      results.positions = await getPositions(sessionKey);
      console.log('✅ Positions carregados:', results.positions.length);
    } catch (e) {
      console.warn('❌ Erro ao carregar positions:', e.message);
    }
    await delay(3000);

    // Lote 5 - Stints
    try {
      results.stints = await getStints(sessionKey);
      console.log('✅ Stints carregados:', results.stints.length);
    } catch (e) {
      console.warn('❌ Erro ao carregar stints:', e.message);
    }
    await delay(3000);

    // Lote 6 - Team Radio (últimas 20 mensagens)
    try {
      results.teamRadio = await getTeamRadio(sessionKey);
      console.log('✅ Team Radio carregado:', results.teamRadio.length);
    } catch (e) {
      console.warn('❌ Erro ao carregar team radio:', e.message);
    }
    await delay(3000);

    // Lote 7 - Weather (tentar buscar últimos dados climáticos)
    try {
      console.log('⏳ Tentando carregar Weather...');
      const weatherResponse = await axios.get(`${BASE_URL}/weather?session_key=${sessionKey}`);
      const weatherData = weatherResponse.data;
      // Pegar apenas os últimos 10 registros
      results.weather = weatherData.length > 10 ? weatherData.slice(-10) : weatherData;
      console.log('✅ Weather carregado:', results.weather.length);
    } catch (e) {
      console.warn('❌ Erro ao carregar weather:', e.message);
      results.weather = [];
    }
    await delay(3000);

    // Lote 8 - Location (usar função otimizada)
    try {
      console.log('⏳ Tentando carregar Location (últimos 30s)...');
      results.locations = await getLocations(sessionKey);
    } catch (e) {
      console.warn('❌ Erro ao carregar location:', e.message);
      results.locations = [];
    }
    await delay(3000);

    // Lote 9 - Race Control (últimos 30 eventos)
    try {
      console.log('⏳ Tentando carregar Race Control...');
      const raceControlResponse = await axios.get(`${BASE_URL}/race_control?session_key=${sessionKey}`);
      const raceControlData = raceControlResponse.data;
      // Pegar apenas os últimos 30 eventos
      results.raceControl = raceControlData.length > 30 ? raceControlData.slice(-30) : raceControlData;
      console.log('✅ Race Control carregado:', results.raceControl.length);
    } catch (e) {
      console.warn('❌ Erro ao carregar race control:', e.message);
      results.raceControl = [];
    }

    console.log('🏁 Carregamento forçado concluído!');
    console.log('📊 Resumo:', {
      drivers: results.drivers.length,
      positions: results.positions.length,
      laps: results.laps.length,
      intervals: results.intervals.length,
      stints: results.stints.length,
      teamRadio: results.teamRadio.length,
      weather: results.weather.length,
      locations: results.locations.length,
      raceControl: results.raceControl.length
    });
    
    return results;

  } catch (error) {
    console.error('Erro geral ao buscar dados forçados:', error);
    return { 
      drivers: [], 
      positions: [], 
      laps: [], 
      intervals: [], 
      locations: [], 
      pitStops: [], 
      stints: [],
      weather: [],
      teamRadio: [],
      raceControl: [],
      session: null
    };
  }
};

// Função para obter dados completos de uma sessão específica
export const getSessionData = async (sessionKey) => {
  try {
    if (!sessionKey) {
      return { 
        drivers: [], 
        positions: [], 
        laps: [], 
        intervals: [], 
        locations: [], 
        pitStops: [], 
        stints: [],
        weather: [],
        teamRadio: [],
        raceControl: [],
        session: null,
        classification: []
      };
    }

    // ESTRATÉGIA CONSERVADORA: Para sessões com muitos dados históricos (como 9869),
    // vamos buscar apenas os dados ESSENCIAIS para evitar exceder 4MB/10s
    
    // Lote 1 - APENAS drivers (pequeno, sempre funciona)
    const drivers = await getDrivers(sessionKey);
    
    await delay(2000); // Aguardar 2 segundos
    
    // Buscar classificação final baseada nas voltas
    const classification = await getRaceClassification(sessionKey);
    
    await delay(2000);
    
    // Todos os outros dados desabilitados temporariamente devido aos limites da API
    // A sessão selecionada (9869) contém dados históricos muito grandes
    const positions = [];
    const laps = [];
    const intervals = [];
    const stints = [];
    const teamRadio = [];
    const locations = [];
    const pitStops = [];
    const raceControl = [];
    const weather = [];

    // Buscar informações da sessão
    const sessionResponse = await axios.get(`${BASE_URL}/sessions?session_key=${sessionKey}`);
    const session = sessionResponse.data.length > 0 ? sessionResponse.data[0] : null;

    return { 
      drivers, 
      positions, 
      laps, 
      intervals, 
      locations, 
      pitStops, 
      stints, 
      weather, 
      teamRadio, 
      raceControl, 
      session,
      classification
    };
  } catch (error) {
    console.error('Erro ao buscar dados da sessão:', error);
    return { 
      drivers: [], 
      positions: [], 
      laps: [], 
      intervals: [], 
      locations: [], 
      pitStops: [], 
      stints: [],
      weather: [],
      teamRadio: [],
      raceControl: [],
      session: null,
      classification: []
    };
  }
};

// Função para processar e combinar dados
export const getFullRaceData = async (sessionKey = null, forceLoad = false) => {
  try {
    let session = null;
    let targetSessionKey = sessionKey;

    // Se não foi fornecido sessionKey, buscar a última sessão
    if (!targetSessionKey) {
      session = await getLatestSession();
      if (!session) {
        return { 
          drivers: [], 
          positions: [], 
          laps: [], 
          intervals: [], 
          locations: [], 
          pitStops: [], 
          stints: [],
          weather: [],
          teamRadio: [],
          raceControl: [],
          session: null
        };
      }
      targetSessionKey = session.session_key;
    }

    // Buscar dados da sessão específica
    const data = forceLoad 
      ? await getSessionDataForced(targetSessionKey)
      : await getSessionData(targetSessionKey);
    
    // Se a sessão não foi buscada ainda, buscar agora
    if (!data.session && targetSessionKey) {
      const sessionResponse = await axios.get(`${BASE_URL}/sessions?session_key=${targetSessionKey}`);
      data.session = sessionResponse.data.length > 0 ? sessionResponse.data[0] : session;
    } else if (!data.session) {
      data.session = session;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar dados completos:', error);
    return { 
      drivers: [], 
      positions: [], 
      laps: [], 
      intervals: [], 
      locations: [], 
      pitStops: [], 
      stints: [],
      weather: [],
      teamRadio: [],
      raceControl: [],
      session: null
    };
  }
};
