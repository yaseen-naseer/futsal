export const formatTime = (minutes: number, seconds: number) => {
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const isWinning = (score1: number, score2: number) => {
  return score1 > score2;
};

