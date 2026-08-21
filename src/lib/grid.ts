export const GRID = 8;
export const CELL = 16;
export const ORIGIN_X = -64;
export const ORIGIN_Z = -64;

export function toCell(x: number, z: number) {
  return {
    cx: Math.floor((x - ORIGIN_X) / CELL),
    cz: Math.floor((z - ORIGIN_Z) / CELL),
  };
}

export function inBounds(cx: number, cz: number) {
  return cx >= 0 && cx < GRID && cz >= 0 && cz < GRID;
}