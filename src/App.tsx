import React, { useState } from 'react';
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
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const gameState = useGameState();
  const { theme, toggleTheme } = useTheme();

  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
  };

  if (window.location.pathname === '/remote') {
    return <RemoteControl />;
  }

  return (
    <div className="App">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      {viewMode === 'overlay' ? (
        <div className="relative min-h-screen bg-transparent">
          <Overlay gameState={gameState.gameState} />
          {/* Floating control button */}
          <ControlPanelButton onClick={() => setViewMode('dashboard')} />
        </div>
      ) : viewMode === 'stats' ? (
        <div className="relative">
          <StatsTracker
            gameState={gameState.gameState}
            updateTeamStats={gameState.updateTeamStats}
            updateTeamScore={(team, value) => gameState.updateTeam(team, 'score', value)}
            switchBallPossession={gameState.switchBallPossession}
            undo={gameState.undo}
            redo={gameState.redo}
          />
          {/* Floating control button */}
          <ControlPanelButton onClick={() => setViewMode('dashboard')} />
        </div>
      ) : viewMode === 'scoreboard' ? (
        <div className="relative">
          <Scoreboard gameState={gameState.gameState} />
          {/* Floating control button */}
          <ControlPanelButton onClick={() => setViewMode('dashboard')} />
        </div>
      ) : viewMode === 'possession' ? (
        <div className="relative">
          <PossessionTracker
            gameState={gameState.gameState}
            switchBallPossession={gameState.switchBallPossession}
          />
          {/* Floating control button */}
          <ControlPanelButton onClick={() => setViewMode('dashboard')} />
        </div>
      ) : (
        <Dashboard
          gameState={gameState.gameState}
          updateTeam={gameState.updateTeam}
          updateTournamentLogo={gameState.updateTournamentLogo}
          updateTime={gameState.updateTime}
          toggleTimer={gameState.toggleTimer}
          resetTimer={gameState.resetTimer}
          updatePeriod={gameState.updatePeriod}
          changeGamePreset={gameState.changeGamePreset}
          resetGame={gameState.resetGame}
          undo={gameState.undo}
          redo={gameState.redo}
          onViewChange={handleViewChange}
        />
      )}
    </div>
  );
}

export default App;
