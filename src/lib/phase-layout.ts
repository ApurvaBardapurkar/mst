import type { ModuleMeta } from "./types";

const CARD_WIDTH = 280;
const COL_GAP = 380;
const ROW_GAP = 260;
const SUBMODULE_ROW_GAP = 120;
const SUBMODULE_COL_GAP = 260;

/** Tree positions per phase — matches 4 / 4 / 9 / 4 module counts */
export function getPhaseTreeLayout(
  modules: ModuleMeta[],
  phaseIndex: number
): { id: string; x: number; y: number }[] {
  const n = modules.length;
  if (n === 0) return [];

  // Keep a simple, readable grid that mirrors the sketch:
  // row of modules with generous spacing, second row slightly offset.
  const grid = (cols: number) =>
    modules.map((m, i) => ({
      id: `mod-${m.id}`,
      x: (i % cols) * COL_GAP,
      y: Math.floor(i / cols) * ROW_GAP,
    }));

  if (phaseIndex === 0 && n === 4) return grid(2);
  if (phaseIndex === 1 && n === 4) return grid(2);
  if (phaseIndex === 2 && n === 9) return grid(3);
  if (phaseIndex === 3 && n === 4) return grid(2);

  const cols = n <= 4 ? 2 : 3;
  return grid(cols);
}

// Layout submodules to the right of the selected module, fanning out
// horizontally like 1.1 → 1.2 → 1.3 from the sketch, without overlapping
// the other module row beneath.
export function getSubmoduleLayout(
  modulePosition: { x: number; y: number },
  count: number
): { id: string; x: number; y: number }[] {
  if (count === 0) return [];

  const baseX = modulePosition.x + COL_GAP * 0.9;
  const baseY = modulePosition.y - SUBMODULE_ROW_GAP / 2;

  return Array.from({ length: count }, (_, i) => ({
    id: `sub-${i}`,
    x: baseX + i * SUBMODULE_COL_GAP,
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

  // Keep module edges simple and readable – mostly a soft zig-zag chain.
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

  for (let i = 0; i < n - 1; i++) {
    edges.push({ source: id(i), target: id(i + 1) });
  }
  return edges;
}
