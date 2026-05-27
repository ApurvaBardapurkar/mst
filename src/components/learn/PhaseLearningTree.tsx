"use client";

import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  useReactFlow,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useMemo, memo, useCallback } from "react";
import {
  Lock,
  CheckCircle2,
  Circle,
  BookOpen,
  Zap,
  Star,
  FileText,
} from "lucide-react";
import type { Curriculum, ModuleMeta, SubmoduleMeta } from "@/lib/types";
import {
  getPhaseTreeLayout,
  getPhaseEdges,
  getSubmoduleLayout,
} from "@/lib/phase-layout";
import {
  getModuleStatus,
  getModuleProgressPercent,
  getSubmoduleProgress,
  isSubmoduleLocked,
  type ModuleStatus,
} from "@/lib/progress";
import { useTheme } from "@/components/ThemeProvider";
import { getCardSubmoduleTitle } from "@/lib/display-titles";
import { stripEmojis } from "@/lib/strip-emojis";

type ModuleCardData = {
  module: ModuleMeta;
  status: ModuleStatus;
  progress: number;
  phaseColor: string;
  isLight: boolean;
  selected: boolean;
  dimmed: boolean;
  onSelect: () => void;
};

const ModuleCard = memo(function ModuleCard({ data }: { data: ModuleCardData }) {
  const { module, status, progress, isLight, selected, dimmed, onSelect } = data;
  const locked = status === "locked";

  const gradientBg =
    status === "active"
      ? isLight
        ? "bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50"
        : "bg-gradient-to-br from-red-950/60 via-orange-950/40 to-yellow-950/30"
      : status === "completed"
        ? isLight
          ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"
          : "bg-gradient-to-br from-emerald-950/60 via-green-950/40 to-teal-950/30"
        : isLight
          ? "bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100"
          : "bg-gradient-to-br from-gray-900/80 via-slate-900/60 to-gray-800/40";

  const handleStyle = { opacity: 0, width: 1, height: 1 } as const;

  return (
    <button
      type="button"
      onClick={() => !locked && onSelect()}
      disabled={locked}
      className={`relative block min-w-[240px] max-w-[280px] rounded-2xl border-2 p-5 text-left transition-all duration-500 ease-out ${gradientBg} ${
        selected
          ? "scale-100 border-mst-red shadow-[0_8px_48px_rgba(227,30,36,0.28)] ring-2 ring-mst-red/20"
          : dimmed
            ? "scale-[0.88] opacity-45 blur-[0.3px]"
            : status === "active"
              ? "border-mst-red/40 shadow-lg hover:scale-[1.02]"
              : status === "completed"
                ? "border-green-500/40 shadow-md hover:scale-[1.02]"
                : isLight
                  ? "border-gray-200/80 hover:scale-[1.02] hover:shadow-md"
                  : "border-white/10 hover:scale-[1.02]"
      } ${locked ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} />

      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-mst-red">
          Module {module.id}
        </span>
        {status === "completed" && (
          <CheckCircle2 size={18} className="text-green-500" />
        )}
        {status === "active" && (
          <span className="relative flex h-5 w-5 items-center justify-center">
            <Circle size={16} className="fill-mst-red text-mst-red" />
            <span className="absolute inset-0 animate-ping rounded-full bg-mst-red/25" />
          </span>
        )}
        {status === "locked" && (
          <Lock size={16} className="text-[var(--text-muted)]" />
        )}
      </div>

      <h3
        className={`mt-2.5 text-sm font-extrabold leading-snug ${isLight ? "text-gray-900" : "text-white"}`}
      >
        {module.title}
      </h3>

      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[var(--text-muted)]">
        {module.description}
      </p>

      <div className="mt-3 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <BookOpen size={12} />
        {module.submodules.length} lessons
        {status === "active" && (
          <span className="rounded-full bg-mst-red/10 px-2 py-0.5 text-[10px] font-bold text-mst-red">
            Active
          </span>
        )}
        {status === "completed" && (
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
        )}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            status === "completed"
              ? "bg-gradient-to-r from-green-400 to-emerald-500"
              : "bg-gradient-to-r from-mst-red to-orange-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </button>
  );
});

type SubmoduleCardData = {
  submodule: SubmoduleMeta;
  moduleId: number;
  index: number;
  locked: boolean;
  done: boolean;
  selected: boolean;
  onSelect: () => void;
  isLight: boolean;
};

const SubmoduleCard = memo(function SubmoduleCard({
  data,
}: {
  data: SubmoduleCardData;
}) {
  const { submodule, index, locked, done, selected, onSelect, isLight } = data;
  const title = getCardSubmoduleTitle(submodule.title);

  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => !locked && onSelect()}
      className={`relative min-w-[180px] max-w-[200px] rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-300 ${
        selected
          ? "scale-105 border-mst-red bg-mst-red/5 shadow-lg ring-2 ring-mst-red/15"
          : done
            ? "border-green-500/40 bg-green-500/5 hover:scale-[1.02]"
            : locked
              ? "cursor-not-allowed border-[var(--border)] opacity-45"
              : isLight
                ? "border-gray-200 bg-white hover:border-mst-red/30 hover:shadow-md"
                : "border-white/10 bg-[#111] hover:border-mst-red/40"
      }`}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 1, height: 1 }} />
      <div className="flex items-start gap-2.5">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-black ${
            done
              ? "bg-green-500 text-white"
              : locked
                ? "bg-[var(--border)] text-[var(--text-muted)]"
                : "bg-mst-red/10 text-mst-red"
          }`}
        >
          {done ? <CheckCircle2 size={14} /> : index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={`text-xs font-bold leading-snug ${isLight ? "text-gray-900" : "text-white"}`}
          >
            {title}
          </p>
          {!locked && (
            <span className="mt-1 flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
              <FileText size={10} />
              Open lesson
            </span>
          )}
        </div>
      </div>
    </button>
  );
});

const nodeTypes = {
  moduleCard: ModuleCard,
  submoduleCard: SubmoduleCard,
};

function FlowCenter({
  phaseId,
  selectedModuleId,
  showSubmodules,
}: {
  phaseId: string;
  selectedModuleId: number | null;
  showSubmodules: boolean;
}) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const t = setTimeout(() => {
      fitView({ padding: showSubmodules ? 0.35 : 0.45, duration: 600 });
    }, 150);
    return () => clearTimeout(t);
  }, [phaseId, selectedModuleId, showSubmodules, fitView]);
  return null;
}

export interface PhaseLearningTreeProps {
  curriculum: Curriculum;
  phaseId: string;
  phaseIndex: number;
  allModuleIds: number[];
  moduleSlugMap: Record<number, string[]>;
  selectedModuleId: number | null;
  selectedSubmoduleSlug: string | null;
  onModuleSelect: (moduleId: number) => void;
  onSubmoduleSelect: (moduleId: number, slug: string) => void;
}

export function PhaseLearningTree({
  curriculum,
  phaseId,
  phaseIndex,
  allModuleIds,
  moduleSlugMap,
  selectedModuleId,
  selectedSubmoduleSlug,
  onModuleSelect,
  onSubmoduleSelect,
}: PhaseLearningTreeProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const getSlugs = useCallback(
    (id: number) => moduleSlugMap[id] ?? [],
    [moduleSlugMap]
  );

  const modules = useMemo(
    () => curriculum.modules.filter((m) => m.phaseId === phaseId),
    [curriculum.modules, phaseId]
  );

  const phaseColors: Record<string, string> = {
    "phase-1": "#3b82f6",
    "phase-2": "#a855f7",
    "phase-3": "#22c55e",
    "phase-4": "#e31e24",
  };
  const color = phaseColors[phaseId] || "#e31e24";

  const selectedModule = modules.find((m) => m.id === selectedModuleId);

  const { nodes, edges } = useMemo(() => {
    const positions = getPhaseTreeLayout(modules, phaseIndex);
    const edgeDefs = getPhaseEdges(modules, phaseIndex);
    const posMap = Object.fromEntries(positions.map((p) => [p.id, p]));

    const flowNodes: Node[] = positions.map((pos) => {
      const mod = modules.find((m) => `mod-${m.id}` === pos.id)!;
      const slugsForMod = mod.submodules.map((s) => s.slug);
      const status = getModuleStatus(mod.id, allModuleIds, slugsForMod, getSlugs);
      const progress = getModuleProgressPercent(mod.id, slugsForMod);
      const isSelected = selectedModuleId === mod.id;
      const dimmed = selectedModuleId !== null && !isSelected;

      return {
        id: pos.id,
        type: "moduleCard",
        position: { x: pos.x, y: pos.y },
        data: {
          module: mod,
          status,
          progress,
          phaseColor: color,
          isLight,
          selected: isSelected,
          dimmed,
          onSelect: () => onModuleSelect(mod.id),
        },
        draggable: false,
        zIndex: isSelected ? 10 : dimmed ? 1 : 5,
      };
    });

    const flowEdges: Edge[] = edgeDefs.map((e, i) => ({
      id: `e-mod-${i}`,
      source: e.source,
      target: e.target,
      type: "smoothstep",
      animated: selectedModuleId === null,
      data: { kind: "module" },
      className: `web3-edge ${selectedModuleId ? "web3-edge--muted" : "web3-edge--idle"}`,
    }));

    if (selectedModule && selectedModuleId) {
      const modPos = posMap[`mod-${selectedModuleId}`];
      if (modPos) {
        const subPositions = getSubmoduleLayout(
          { x: modPos.x, y: modPos.y },
          selectedModule.submodules.length
        );

        selectedModule.submodules.forEach((sub, subIdx) => {
          const sp = getSubmoduleProgress(selectedModuleId, sub.slug);
          const modSlugs = selectedModule.submodules.map((s) => s.slug);
          const modStatus = getModuleStatus(
            selectedModuleId,
            allModuleIds,
            modSlugs,
            getSlugs
          );
          const locked = isSubmoduleLocked(
            modStatus === "locked",
            subIdx,
            selectedModuleId,
            selectedModule.submodules
          );
          const done = sp.lessonComplete && sp.assessmentComplete;
          const subPos = subPositions[subIdx];

          flowNodes.push({
            id: `sub-${selectedModuleId}-${sub.slug}`,
            type: "submoduleCard",
            position: { x: subPos.x, y: subPos.y },
            data: {
              submodule: sub,
              moduleId: selectedModuleId,
              index: subIdx,
              locked,
              done,
              selected: selectedSubmoduleSlug === sub.slug,
              isLight,
              onSelect: () => onSubmoduleSelect(selectedModuleId, sub.slug),
            },
            draggable: false,
            zIndex: 20,
          });

          flowEdges.push({
            id: `e-mod-sub-${sub.slug}`,
            source: `mod-${selectedModuleId}`,
            target: `sub-${selectedModuleId}-${sub.slug}`,
            type: "smoothstep",
            animated: true,
            data: { kind: "active" },
            className: "web3-edge web3-edge--active",
          });

          if (subIdx > 0) {
            const prev = selectedModule.submodules[subIdx - 1];
            flowEdges.push({
              id: `e-sub-chain-${sub.slug}`,
              source: `sub-${selectedModuleId}-${prev.slug}`,
              target: `sub-${selectedModuleId}-${sub.slug}`,
              type: "smoothstep",
              animated: true,
              data: { kind: "path" },
              className: "web3-edge web3-edge--path",
            });
          }
        });
      }
    }

    return { nodes: flowNodes, edges: flowEdges };
  }, [
    modules,
    phaseIndex,
    allModuleIds,
    moduleSlugMap,
    isLight,
    color,
    selectedModuleId,
    selectedSubmoduleSlug,
    selectedModule,
    getSlugs,
    onModuleSelect,
    onSubmoduleSelect,
  ]);

  return (
    <div className="h-full w-full learn-tree-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        minZoom={0.2}
        maxZoom={1.4}
        panOnScroll
        zoomOnScroll
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color={isLight ? "#d1d5db" : "#1a1a1a"} gap={28} />
        <Controls
          className={
            isLight
              ? "!border-gray-200 !bg-white !rounded-xl !shadow-lg [&>button]:!bg-gray-50 [&>button]:!text-gray-800"
              : "!bg-[#111] !border-white/10 !rounded-xl [&>button]:!bg-[#222] [&>button]:!text-white"
          }
        />
        <FlowCenter
          phaseId={phaseId}
          selectedModuleId={selectedModuleId}
          showSubmodules={selectedModuleId !== null}
        />
      </ReactFlow>
    </div>
  );
}
