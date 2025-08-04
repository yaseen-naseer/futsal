export const formatTime = (minutes: number, seconds: number): string => {
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const isWinning = (teamScore: number, opponentScore: number): boolean => {
  return teamScore > opponentScore;
};
