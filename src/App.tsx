import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { Scoreboard } from './components/Scoreboard';
import { Dashboard } from './components/Dashboard';
import { Overlay } from './components/Overlay';
import { StatsTracker } from './components/StatsTracker';
import { PossessionTracker } from './components/PossessionTracker';

type ViewMode = 'scoreboard' | 'dashboard' | 'overlay' | 'stats' | 'possession';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const gameState = useGameState();

  const handleViewChange = (view: ViewMode) => {
    setViewMode(view);
  };

  return (
    <div className="App">
      {viewMode === 'overlay' ? (
        <div className="relative min-h-screen bg-transparent">
          <Overlay gameState={gameState.gameState} />
          {/* Floating control button */}
          <button
            onClick={() => setViewMode('dashboard')}
            className="fixed top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors backdrop-blur-sm z-50"
          >
            Control Panel
          </button>
        </div>
      ) : viewMode === 'stats' ? (
        <div className="relative">
          <StatsTracker 
            gameState={gameState.gameState}
            updateTeamStats={gameState.updateTeamStats}
            switchBallPossession={gameState.switchBallPossession}
          />
          {/* Floating control button */}
          <button
            onClick={() => setViewMode('dashboard')}
            className="fixed top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors backdrop-blur-sm z-50"
          >
            Control Panel
          </button>
        </div>
      ) : viewMode === 'scoreboard' ? (
        <div className="relative">
          <Scoreboard gameState={gameState.gameState} />
          {/* Floating control button */}
          <button
            onClick={() => setViewMode('dashboard')}
            className="fixed top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors backdrop-blur-sm z-50"
          >
            Control Panel
          </button>
        </div>
      ) : viewMode === 'possession' ? (
        <div className="relative">
          <PossessionTracker 
            gameState={gameState.gameState}
            switchBallPossession={gameState.switchBallPossession}
          />
          {/* Floating control button */}
          <button
            onClick={() => setViewMode('dashboard')}
            className="fixed top-4 right-4 bg-black/50 text-white px-4 py-2 rounded-lg hover:bg-black/70 transition-colors backdrop-blur-sm z-50"
          >
            Control Panel
          </button>
        </div>
      ) : (
        <Dashboard
          gameState={gameState.gameState}
          updateTeam={gameState.updateTeam}
          updateTournamentLogo={gameState.updateTournamentLogo}
          updateTeamStats={gameState.updateTeamStats}
          switchBallPossession={gameState.switchBallPossession}
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
