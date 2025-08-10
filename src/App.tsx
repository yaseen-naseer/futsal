import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useGameState } from './hooks/useGameState';
import { useTheme } from './hooks/useTheme';
import { Dashboard } from './components/Dashboard';
import { StatsTracker } from './components/StatsTracker';
import { ControlPanelButton } from './components/ControlPanelButton';
import { ThemeToggle } from './components/ThemeToggle';
import { SettingsProvider } from './hooks/SettingsProvider';
import { SettingsPage } from './components/SettingsPage';

type ViewMode = 'dashboard' | 'stats' | 'settings';

type GameStateType = ReturnType<typeof useGameState>;

interface ViewProps {
  gameState: GameStateType;
}

const StatsView: React.FC<ViewProps> = ({ gameState }) => {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <StatsTracker
        gameState={gameState.gameState}
        updateTeamStats={gameState.updateTeamStats}
        updateTeamScore={(team, value) => gameState.updateTeam(team, 'score', value)}
        updateTeamFouls={(team, value) => gameState.updateTeam(team, 'fouls', value)}
        updatePlayerStats={gameState.updatePlayerStats}
        switchBallPossession={gameState.switchBallPossession}
        undo={gameState.undo}
        redo={gameState.redo}
      />
      <ControlPanelButton onClick={() => navigate('/dashboard')} />
    </div>
  );
};

interface SettingsViewProps extends ViewProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ gameState, theme, toggleTheme }) => {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <SettingsPage
        gameState={gameState.gameState}
        updateTournamentLogo={gameState.updateTournamentLogo}
        updateTournamentName={gameState.updateTournamentName}
        resetGame={gameState.resetGame}
        updateTeam={gameState.updateTeam}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <ControlPanelButton onClick={() => navigate('/dashboard')} />
    </div>
  );
};

interface MainLayoutProps {
  gameState: GameStateType;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ gameState, theme, toggleTheme }) => {
  const navigate = useNavigate();

  const handleViewChange = (view: ViewMode) => {
    navigate(`/${view}`);
  };

  return (
    <div className="App">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <Dashboard
              gameState={gameState.gameState}
              updateTeam={gameState.updateTeam}
              updateTime={gameState.updateTime}
              toggleTimer={gameState.toggleTimer}
              resetTimer={gameState.resetTimer}
              updatePeriod={gameState.updatePeriod}
              changeGamePreset={gameState.changeGamePreset}
              undo={gameState.undo}
              redo={gameState.redo}
              addPlayer={gameState.addPlayer}
              removePlayer={gameState.removePlayer}
              onViewChange={handleViewChange}
            />
          }
        />
        <Route path="/stats" element={<StatsView gameState={gameState} />} />
        <Route path="/settings" element={<SettingsView gameState={gameState} theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
};

const AppContent: React.FC = () => {
  const gameState = useGameState();
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={<MainLayout gameState={gameState} theme={theme} toggleTheme={toggleTheme} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App;
