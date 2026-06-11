export function formatPercent(value: number) {
  return `${value > 0 ? '+' : ''}${value}%`;
}

export function formatScore(value: number) {
  return `${Math.round(value)}分`;
}

export function formatMinutes(value: number) {
  if (value < 60) return `${value}分钟`;
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return minutes === 0 ? `${hours}小时` : `${hours}小时${minutes}分钟`;
}
