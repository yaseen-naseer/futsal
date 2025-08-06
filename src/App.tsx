import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { useGameState } from './hooks/useGameState';
import { useTheme } from './hooks/useTheme';
import { Scoreboard } from './components/Scoreboard';
import { Dashboard } from './components/Dashboard';
import { Overlay } from './components/Overlay';
import { StatsTracker } from './components/StatsTracker';
import { PossessionTracker } from './components/PossessionTracker';
import { ControlPanelButton } from './components/ControlPanelButton';
import { ThemeToggle } from './components/ThemeToggle';
import { RemoteControl } from './components/RemoteControl';

type ViewMode = 'scoreboard' | 'dashboard' | 'overlay' | 'stats' | 'possession';

function App() {
  const gameState = useGameState();
  const { theme, toggleTheme } = useTheme();

  const MainLayout: React.FC = () => {
    const navigate = useNavigate();

    const handleViewChange = (view: ViewMode) => {
      navigate(`/${view}`);
    };

    const ScoreboardView: React.FC = () => (
      <div className="relative">
        <Scoreboard gameState={gameState.gameState} />
        <ControlPanelButton onClick={() => navigate('/dashboard')} />
      </div>
    );

    const OverlayView: React.FC = () => (
      <div className="relative min-h-screen bg-transparent">
        <Overlay gameState={gameState.gameState} />
        <ControlPanelButton onClick={() => navigate('/dashboard')} />
      </div>
    );

    const StatsView: React.FC = () => (
      <div className="relative">
        <StatsTracker
          gameState={gameState.gameState}
          updateTeamStats={gameState.updateTeamStats}
          updateTeamScore={(team, value) =>
            gameState.updateTeam(team, 'score', value)
          }
          updateTeamFouls={(team, value) =>
            gameState.updateTeam(team, 'fouls', value)
          }
          updatePlayerStats={gameState.updatePlayerStats}
          switchBallPossession={gameState.switchBallPossession}
          undo={gameState.undo}
          redo={gameState.redo}
        />
        <ControlPanelButton onClick={() => navigate('/dashboard')} />
      </div>
    );

    const PossessionView: React.FC = () => (
      <div className="relative">
        <PossessionTracker
          gameState={gameState.gameState}
          switchBallPossession={gameState.switchBallPossession}
        />
        <ControlPanelButton onClick={() => navigate('/dashboard')} />
      </div>
    );

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
                updateTournamentLogo={gameState.updateTournamentLogo}
                updateTournamentName={gameState.updateTournamentName}
                updateTime={gameState.updateTime}
                toggleTimer={gameState.toggleTimer}
                resetTimer={gameState.resetTimer}
                updatePeriod={gameState.updatePeriod}
                changeGamePreset={gameState.changeGamePreset}
                resetGame={gameState.resetGame}
                undo={gameState.undo}
                redo={gameState.redo}
                addPlayer={gameState.addPlayer}
                removePlayer={gameState.removePlayer}
                onViewChange={handleViewChange}
              />
            }
          />
          <Route path="/scoreboard" element={<ScoreboardView />} />
          <Route path="/overlay" element={<OverlayView />} />
          <Route path="/stats" element={<StatsView />} />
          <Route path="/possession" element={<PossessionView />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/remote" element={<RemoteControl />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
