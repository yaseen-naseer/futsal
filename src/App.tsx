import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { Scoreboard } from './components/Scoreboard';
import { Dashboard } from './components/Dashboard';
import { Overlay } from './components/Overlay';
import { StatsTracker } from './components/StatsTracker';
import { PossessionTracker } from './components/PossessionTracker';
import { ControlPanelButton } from './components/ControlPanelButton';

type ViewMode = 'scoreboard' | 'dashboard' | 'overlay' | 'stats' | 'possession';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [showStats, setShowStats] = useState(false);
  const gameState = useGameState();

  const handleViewChange = (view: ViewMode, stats: boolean = false) => {
    setViewMode(view);
    setShowStats(stats);
  };

  return (
    <div className="App">
      {viewMode === 'overlay' ? (
        <div className="relative min-h-screen bg-transparent">
          <Overlay gameState={gameState.gameState} showStats={showStats} />
          {/* Floating control button */}
          <ControlPanelButton onClick={() => setViewMode('dashboard')} />
        </div>
      ) : viewMode === 'stats' ? (
        <div className="relative">
          <StatsTracker
            gameState={gameState.gameState}
            updateTeamStats={gameState.updateTeamStats}
            switchBallPossession={gameState.switchBallPossession}
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
          onViewChange={handleViewChange}
        />
      )}
    </div>
  );
}

export default App;
