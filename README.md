# 🏎️ F1 Dashboard Completo - React

Dashboard completo e em tempo real da Fórmula 1, consumindo TODOS os dados disponíveis na API OpenF1.

🚀 **[Acesse o Dashboard ao Vivo](https://danvneitzel.github.io/f1-dashboard-react/)**

![F1 Dashboard](https://img.shields.io/badge/F1-Dashboard-red?style=for-the-badge&logo=formula1)
*![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)*
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript)
![Status](https://img.shields.io/badge/Status-Live-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## 🎯 Funcionalidades Completas

### 📊 Classificação ao Vivo
- **Posição em tempo real** de todos os pilotos
- **Nome e equipe** com cores identificadoras
- **Intervalos** para o líder e piloto à frente
- **Melhor volta** e **última volta** de cada piloto
- **Mini setores** coloridos mostrando performance:
  - 🟣 Roxo = Melhor geral (Purple sector)
  - 🟢 Verde = Melhor pessoal (Green sector)
  - 🟡 Amarelo = Tempo normal
  - 🔴 Vermelho = Pit lane
- **Tipo de pneu** atual com cores:
  - 🔴 SOFT (vermelho)
  - 🟡 MEDIUM (amarelo)
  - ⚪ HARD (branco)
  - 🟢 INTERMEDIATE (verde)
  - 🔵 WET (azul)
- **Número de pit stops** realizados
- **Velocidade máxima** (Top Speed)
- **Tempo do último setor**
- **Controle de visibilidade de colunas** - mostre/oculte colunas específicas
- **Ordenação personalizável** - clique nos cabeçalhos para ordenar por qualquer coluna

### 👁️ Menu de Visibilidade de Blocos
- **Menu sticky no topo** que permanece visível ao rolar a página
- **Controle individual** de cada seção do dashboard:
  - 📍 Informações da Sessão
  - 🌤️ Clima e Mapa
  - 📊 Tabela de Pilotos
  - ⚙️ Controle de Colunas
  - 📖 Legenda
  - 📡 Comunicações e Eventos
- **Ações rápidas**: Mostrar/Ocultar todos os blocos de uma vez
- **Contador visual** mostrando quantos blocos estão visíveis
- **Interface expansível** - clique para abrir/fechar o painel

### ⚔️ Modo Comparação de Pilotos
- **Compare dois pilotos lado a lado** com estatísticas detalhadas
- **Gráfico de tempos de volta** comparativo
- **Análise de setores** individuais
- **Estatísticas completas**: melhor volta, média de voltas, velocidade máxima
- **Histórico de pit stops** de ambos os pilotos
- **Seleção fácil** de pilotos com dropdown organizado por equipe

### 🗺️ Mapa da Corrida em Tempo Real
- Visualização das **posições GPS** de todos os carros no circuito
- Cores das equipes para fácil identificação
- Atualização automática a cada 5 segundos

### 🌤️ Condições Meteorológicas
- **Temperatura do ar** e **da pista**
- **Umidade** relativa
- **Chuva** (sim/não)
- **Velocidade** e **direção do vento**
- **Pressão** atmosférica
- Atualizado a cada minuto

### 📍 Informações da Sessão
- Nome oficial da corrida
- Tipo de sessão (Prática, Qualificação, Corrida)
- Nome do circuito e localização
- Data e horário de início
- GMT offset
- **Filtro de sessões** - visualize dados de corridas anteriores
- **Modo forçado** - carregamento completo de dados históricos (até 30s)
- **Indicador de status** - mostra quais dados foram carregados com sucesso

### 📻 Rádio da Equipe
- Comunicações de rádio entre pilotos e equipes
- Player de áudio integrado
- Filtro por piloto
- Últimas 20 mensagens
- Timestamp de cada comunicação

### 🚦 Controle da Corrida
- Eventos de bandeiras (Verde, Amarela, Vermelha, Quadriculada)
- Safety Car e Virtual Safety Car
- Status do DRS (Drag Reduction System)
- Incidentes e penalidades
- Mensagens oficiais da direção de prova
- Últimos 30 eventos

## 🔧 Tecnologias Utilizadas

- **React** 18.3.1 (Última versão estável)
- **Axios** 1.6.x para requisições HTTP
- **OpenF1 API** para dados em tempo real
- **CSS Modules** / **Styled Components** (opcional)
- **React Hooks** para gerenciamento de estado
- **Web Audio API** para reprodução de rádio
- **Canvas API** para renderização do mapa
- **LocalStorage** para cache e preferências

## 📡 Endpoints da API Utilizados

O dashboard consome TODOS os principais endpoints da OpenF1 API:

1. ✅ **Sessions** - Informações da sessão atual
2. ✅ **Drivers** - Dados dos pilotos
3. ✅ **Position** - Posições em tempo real
4. ✅ **Laps** - Dados de voltas e setores
5. ✅ **Intervals** - Intervalos entre pilotos
6. ✅ **Location** - Coordenadas GPS dos carros
7. ✅ **Pit** - Paradas nos boxes
8. ✅ **Stints** - Períodos com cada tipo de pneu
9. ✅ **Weather** - Condições meteorológicas
10. ✅ **Team Radio** - Comunicações de rádio
11. ✅ **Race Control** - Eventos e bandeiras

## 🚀 Como Executar

### Pré-requisitos
- **Node.js** 18.x ou superior (recomendado: 20.x LTS)
- **npm** 9.x ou **yarn** 1.22.x / **pnpm** 8.x
- Navegador moderno (Chrome 120+, Firefox 121+, Edge 120+, Safari 17+)

### Instalação e Execução

```bash
# 1. Clonar o repositório (se ainda não tiver)
git clone https://github.com/seu-usuario/f1-dashboard-react.git

# 2. Navegar até o diretório do projeto
cd f1-dashboard-react

# 3. Instalar dependências
npm install
# ou com yarn
yarn install
# ou com pnpm
pnpm install

# 4. Configurar variáveis de ambiente (opcional)
cp .env.example .env

# 5. Iniciar servidor de desenvolvimento
npm start
# ou
yarn start
# ou
pnpm start

# 6. Abrir no navegador
# O app abrirá automaticamente em http://localhost:3000
```

### Build para Produção

```bash
# Criar build otimizado
npm run build

# Servir build localmente para testar
npx serve -s build
```

### Deploy

O projeto pode ser facilmente deployado em:

- **Vercel**: `npx vercel`
- **Netlify**: Arraste a pasta `build` para netlify.com
- **GitHub Pages**: Configure no repositório
- **Docker**: `docker build -t f1-dashboard .`

## 📦 Estrutura do Projeto

```
f1-dashboard-react/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Dashboard.js           # Componente principal
│   │   ├── DriverRow.js           # Linha de cada piloto
│   │   ├── MiniSector.js          # Mini setores coloridos
│   │   ├── RaceMap.js             # Mapa da corrida
│   │   ├── RaceInfo.js            # Info da sessão
│   │   ├── WeatherWidget.js       # Widget de clima
│   │   ├── TeamRadio.js           # Rádio da equipe
│   │   ├── RaceControl.js         # Controle da corrida
│   │   ├── BlockVisibilityMenu.js # Menu de visibilidade
│   │   ├── DriverComparison.js    # Comparação de pilotos
│   │   ├── DriverSelector.js      # Seletor de pilotos
│   │   ├── ComparisonStats.js     # Estatísticas comparativas
│   │   ├── LapTimeChart.js        # Gráfico de tempos
│   │   ├── SessionFilter.js       # Filtro de sessões
│   │   ├── SkeletonLoader.js      # Loading animado
│   │   └── NoSessionModal.js      # Modal de sessão inativa
│   ├── services/
│   │   ├── api.js             # Chamadas para OpenF1 API
│   │   └── cache.js           # Sistema de cache
│   ├── hooks/
│   │   ├── useRaceData.js     # Hook para dados da corrida
│   │   └── useWebSocket.js    # Hook para conexão em tempo real
│   ├── utils/
│   │   ├── formatters.js      # Formatação de dados
│   │   └── constants.js       # Constantes do app
│   ├── styles/
│   │   └── global.css         # Estilos globais
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🎨 Design

- ✨ **Dark Mode** nativo
- 🎨 **Cores das equipes** para fácil identificação
- 📱 **Layout responsivo** adaptável a diferentes tamanhos de tela
- 🎯 **Scrollbar personalizada** com tema F1
- 🔄 **Atualização automática** a cada 5 segundos
- 🎭 **Interface inspirada** na transmissão oficial da F1

## 📊 Dados em Tempo Real

O dashboard atualiza automaticamente:
- ✅ Posições e tempos a cada **5 segundos**
- ✅ Clima a cada **1 minuto** (conforme API)
- ✅ Localizações GPS a cada **~0.27 segundos** (3.7 Hz)
- ✅ Eventos de controle em **tempo real**
- ✅ Rádios da equipe conforme disponíveis

## ⚠️ Importante

- Os dados são fornecidos pela **OpenF1 API**
- Dados históricos são **gratuitos**
- Dados em tempo real durante corridas ao vivo requerem **conta paga**
- Sem necessidade de autenticação para dados históricos
- Durante corridas ativas, alguns endpoints podem ter atraso de ~3 segundos

## 🔗 Links Úteis

- [OpenF1 API Documentation](https://openf1.org/)
- [Formula 1 Official Website](https://www.formula1.com/)
- [OpenF1 GitHub](https://github.com/br-g/openf1)

## 💡 Dicas de Uso

1. **Para visualizar corridas anteriores**: Use o filtro de sessões no topo do dashboard
2. **Para carregar dados completos**: Ative o "Modo Forçado" (pode levar até 30 segundos)
3. **Para comparar pilotos**: Clique no botão "⚔️ Comparar Pilotos" e selecione dois pilotos
4. **Para personalizar a visualização**: Use o menu "👁️ Visibilidade dos Blocos" no topo
5. **Para ocultar colunas**: Use os botões de controle acima da tabela de classificação
6. **Para ordenar dados**: Clique nos cabeçalhos das colunas (posição, piloto, melhor volta, etc.)
7. **Para ver detalhes**: Hover sobre elementos para informações adicionais
8. **Para melhor experiência**: Use tela grande ou modo paisagem em dispositivos móveis

## 🐛 Troubleshooting

### Dados não aparecem?
- Verifique se há uma sessão ativa ou use dados históricos
- Confirme a conexão com a internet
- Verifique o console do navegador para erros

### Performance lenta?
- Reduza o intervalo de atualização em `Dashboard.js`
- Limite o número de eventos exibidos
- Utilize React DevTools para identificar re-renders desnecessários
- Considere implementar virtualização para listas grandes
- Habilite cache no navegador

### Erro de CORS?
- A OpenF1 API suporta CORS, mas verifique se está usando HTTPS
- Em desenvolvimento, configure um proxy no `package.json`
- Considere usar um proxy reverso em produção

### Áudio do rádio não funciona?
- Verifique permissões do navegador para reprodução de mídia
- Alguns navegadores bloqueiam autoplay de áudio
- Tente interagir com a página antes de reproduzir

## 🚧 Roadmap

- [x] ✅ Implementar modo comparação de pilotos
- [x] ✅ Menu de visibilidade de blocos
- [x] ✅ Controle de visibilidade de colunas
- [x] ✅ Ordenação de colunas na tabela
- [x] ✅ Filtro de sessões históricas
- [x] ✅ Modo forçado para dados completos
- [ ] Adicionar suporte a WebSocket para dados instantâneos
- [ ] Adicionar gráficos de telemetria avançada
- [ ] Sistema de notificações para eventos importantes
- [ ] Modo PWA (Progressive Web App)
- [ ] Suporte multi-idioma (PT, EN, ES)
- [ ] Tema claro/escuro alternável
- [ ] Integração com outros APIs de F1
- [ ] Dashboard personalizável (drag & drop)
- [ ] Análise de estratégia de corrida com IA
- [ ] Exportação de dados em CSV/JSON
- [ ] Modo teatro (tela cheia sem distrações)

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👥 Autores

- **Daniel Neitzel** - *Desenvolvimento Inicial* - [GitHub](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- OpenF1 API pela disponibilização dos dados
- Comunidade F1 por feedback e sugestões
- Todos os contribuidores do projeto

## 📧 Contato

Para dúvidas ou sugestões, abra uma [issue](https://github.com/seu-usuario/f1-dashboard-react/issues) no GitHub.

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

**Aviso**: Este é um projeto não oficial e não está associado à Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP são marcas registradas da Formula One Licensing B.V.

---

**Desenvolvido com ❤️ para fãs de F1 | Powered by OpenF1 API**

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!
