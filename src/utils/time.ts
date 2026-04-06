export function toStringSecond(addSec: number): string {
  const parsedSec = Math.max(0, Math.floor(addSec));

  let hour = 0;
  let min = 0;
  let sec = 0;

  if (parsedSec / 60 > 60) {
    hour = Math.floor(parsedSec / 60 / 60);
    min = Math.floor((parsedSec / 60) % 60);
    sec = Math.floor(parsedSec % 60);

    return `${hour}시간 ${min}분 ${sec}초`;
  }

  min = Math.floor(parsedSec / 60);
  sec = Math.floor(parsedSec % 60);

  return min > 0 ? `${min}분 ${sec}초` : `${sec}초`;
}
