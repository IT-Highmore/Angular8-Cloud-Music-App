// 限制在min和max之间
export function limitNumberInRange(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

// 获取百分比
export function getPercent(min: number, max: number, val: number): number {
  return ((val - min) / (max - min)) * 100;
}

// 取[min, max]之间的一个随机数
export function getRandomInt(range: [number, number]): number {
  return Math.floor(Math.random() * (range[1] - range[0] + 1) + range[0]);
}
