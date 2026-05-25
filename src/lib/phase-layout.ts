import type { ModuleMeta } from "./types";

/** Avax-style tree positions per phase — progression path with branches */
export function getPhaseTreeLayout(
  modules: ModuleMeta[],
  phaseIndex: number
): { id: string; x: number; y: number }[] {
  const ids = modules.map((m) => `mod-${m.id}`);
  const n = ids.length;

  if (n === 0) return [];

  // Phase 1 (4 mods): funnel — 1 top, 2 middle, 1 bottom converge
  if (n === 4 && phaseIndex === 0) {
    return [
      { id: ids[0], x: 400, y: 0 },
      { id: ids[1], x: 220, y: 180 },
      { id: ids[2], x: 580, y: 180 },
      { id: ids[3], x: 400, y: 360 },
    ];
  }

  // Phase 2 (4 mods): linear spine with side branches
  if (n === 4 && phaseIndex === 1) {
    return [
      { id: ids[0], x: 400, y: 0 },
      { id: ids[1], x: 400, y: 180 },
      { id: ids[2], x: 200, y: 400 },
      { id: ids[3], x: 600, y: 400 },
    ];
  }

  // Phase 4 (4 mods): diamond merge pattern
  if (n === 4 && phaseIndex === 3) {
    return [
      { id: ids[0], x: 400, y: 0 },
      { id: ids[1], x: 220, y: 160 },
      { id: ids[2], x: 580, y: 160 },
      { id: ids[3], x: 400, y: 320 },
    ];
  }

  // Phase 3 (9 modules): wider branching tree
  if (n >= 7) {
    const positions: { id: string; x: number; y: number }[] = [];
    const cols = 3;
    modules.forEach((m, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const offsetX = row % 2 === 0 ? 0 : 80;
      positions.push({
        id: `mod-${m.id}`,
        x: 120 + col * 280 + offsetX,
        y: row * 160,
      });
    });
    return positions;
  }

  // Default: vertical path with slight zigzag
  return modules.map((m, i) => ({
    id: `mod-${m.id}`,
    x: 400 + (i % 2 === 0 ? -120 : 120),
    y: i * 150,
  }));
}

export function getPhaseEdges(
  modules: ModuleMeta[],
  phaseIndex: number
): { source: string; target: string }[] {
  const edges: { source: string; target: string }[] = [];
  const n = modules.length;

  // Funnel / diamond for 4-module phases
  if (n === 4 && (phaseIndex === 0 || phaseIndex === 3)) {
    const [a, b, c, d] = modules.map((m) => `mod-${m.id}`);
    edges.push(
      { source: a, target: b },
      { source: a, target: c },
      { source: b, target: d },
      { source: c, target: d }
    );
    return edges;
  }

  // Phase 2: spine + branches
  if (n === 4 && phaseIndex === 1) {
    const [a, b, c, d] = modules.map((m) => `mod-${m.id}`);
    edges.push(
      { source: a, target: b },
      { source: b, target: c },
      { source: b, target: d }
    );
    return edges;
  }

  for (let i = 0; i < n - 1; i++) {
    edges.push({
      source: `mod-${modules[i].id}`,
      target: `mod-${modules[i + 1].id}`,
    });
  }
  return edges;
}
