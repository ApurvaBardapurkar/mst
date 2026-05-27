import type { ModuleMeta } from "./types";

const CARD_WIDTH = 280;
const COL_GAP = 380;
const ROW_GAP = 260;
const SUBMODULE_ROW_GAP = 100;
const SUBMODULE_COL_GAP = 220;

/** Tree positions per phase — matches 4 / 4 / 9 / 4 module counts */
export function getPhaseTreeLayout(
  modules: ModuleMeta[],
  phaseIndex: number
): { id: string; x: number; y: number }[] {
  const n = modules.length;
  if (n === 0) return [];

  const grid = (cols: number) =>
    modules.map((m, i) => ({
      id: `mod-${m.id}`,
      x: (i % cols) * COL_GAP,
      y: Math.floor(i / cols) * ROW_GAP,
    }));

  if (phaseIndex === 0 && n === 4) return grid(2);
  if (phaseIndex === 1 && n === 4) {
    return modules.map((m, i) => ({
      id: `mod-${m.id}`,
      x: (i % 2) * COL_GAP + (i >= 2 ? 60 : 0),
      y: Math.floor(i / 2) * ROW_GAP,
    }));
  }
  if (phaseIndex === 2 && n === 9) return grid(3);
  if (phaseIndex === 3 && n === 4) return grid(2);

  const cols = n <= 4 ? 2 : 3;
  return grid(cols);
}

export function getSubmoduleLayout(
  modulePosition: { x: number; y: number },
  count: number
): { id: string; x: number; y: number }[] {
  const baseY = modulePosition.y + ROW_GAP + 40;
  const totalWidth = (count - 1) * SUBMODULE_COL_GAP;
  const startX = modulePosition.x - totalWidth / 2;

  return Array.from({ length: count }, (_, i) => ({
    id: `sub-${i}`,
    x: startX + i * SUBMODULE_COL_GAP,
    y: baseY + (i % 2) * SUBMODULE_ROW_GAP,
  }));
}

export function getLayoutCenterX(positions: { x: number }[]): number {
  if (positions.length === 0) return 0;
  const minX = Math.min(...positions.map((p) => p.x));
  const maxX = Math.max(...positions.map((p) => p.x));
  return minX + (maxX + CARD_WIDTH - minX) / 2;
}

export function getPhaseEdges(
  modules: ModuleMeta[],
  phaseIndex: number
): { source: string; target: string }[] {
  const edges: { source: string; target: string }[] = [];
  const n = modules.length;
  if (n < 2) return edges;

  const id = (i: number) => `mod-${modules[i].id}`;

  if (phaseIndex === 0 && n === 4) {
    edges.push(
      { source: id(0), target: id(1) },
      { source: id(0), target: id(2) },
      { source: id(1), target: id(3) },
      { source: id(2), target: id(3) }
    );
    return edges;
  }

  if (phaseIndex === 1 && n === 4) {
    edges.push(
      { source: id(0), target: id(1) },
      { source: id(0), target: id(2) },
      { source: id(1), target: id(3) },
      { source: id(2), target: id(3) }
    );
    return edges;
  }

  if (phaseIndex === 2 && n === 9) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 2; col++) {
        edges.push({ source: id(row * 3 + col), target: id(row * 3 + col + 1) });
      }
    }
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 2; row++) {
        edges.push({ source: id(row * 3 + col), target: id((row + 1) * 3 + col) });
      }
    }
    return edges;
  }

  if (phaseIndex === 3 && n === 4) {
    edges.push(
      { source: id(0), target: id(1) },
      { source: id(0), target: id(2) },
      { source: id(1), target: id(3) },
      { source: id(2), target: id(3) }
    );
    return edges;
  }

  for (let i = 0; i < n - 1; i++) {
    edges.push({ source: id(i), target: id(i + 1) });
  }
  return edges;
}
