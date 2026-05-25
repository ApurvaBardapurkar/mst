"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  type Node,
  type Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { Lock, CheckCircle2, Circle } from "lucide-react";
import type { Curriculum, ModuleMeta } from "@/lib/types";
import { getPhaseTreeLayout, getPhaseEdges } from "@/lib/phase-layout";
import {
  getModuleStatus,
  getModuleProgressPercent,
  type ModuleStatus,
} from "@/lib/progress";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";

function ModuleCard({
  data,
}: {
  data: {
    module: ModuleMeta;
    status: ModuleStatus;
    progress: number;
    href: string;
    phaseColor: string;
    isLight: boolean;
  };
}) {
  const { module, status, progress, href, phaseColor, isLight } = data;
  const locked = status === "locked";

  const card = (
    <div
      className={`relative min-w-[200px] max-w-[240px] rounded-2xl border-2 p-4 shadow-lg transition-all duration-300 ${
        isLight ? "bg-white" : "bg-[var(--card-bg)]"
      } ${
        status === "active"
          ? "border-mst-red shadow-[0_0_28px_rgba(227,30,36,0.2)]"
          : status === "completed"
            ? "border-green-500/60"
            : isLight
              ? "border-gray-200 opacity-70"
              : "border-white/10 opacity-60"
      } ${locked ? "pointer-events-none cursor-not-allowed" : "hover:shadow-xl"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: phaseColor }}
        />
        {status === "completed" && (
          <CheckCircle2 size={18} className="text-green-500" />
        )}
        {status === "active" && (
          <Circle size={18} className="fill-mst-red text-mst-red" />
        )}
        {status === "locked" && (
          <Lock size={16} className="text-[var(--text-muted)]" />
        )}
      </div>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-mst-red">
        Module {module.id}
      </p>
      <h3
        className={`mt-1 text-sm font-bold leading-snug ${isLight ? "text-gray-900" : "text-white"}`}
      >
        {module.title}
      </h3>
      <p className="mt-2 text-xs text-[var(--text-muted)]">
        {module.submodules.length} lessons
      </p>
      <div
        className={`mt-3 h-1 overflow-hidden rounded-full ${isLight ? "bg-gray-200" : "bg-white/10"}`}
      >
        <div
          className="h-full bg-mst-red transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      {status === "active" && (
        <span className="mt-2 inline-block text-[10px] font-semibold text-mst-red">
          Continue →
        </span>
      )}
    </div>
  );

  if (locked) return card;
  return (
    <Link href={href} className="block">
      {card}
    </Link>
  );
}

const nodeTypes = { moduleCard: ModuleCard };

function FlowCenter({ phaseId }: { phaseId: string }) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const t = setTimeout(() => {
      fitView({ padding: 0.35, duration: 500 });
    }, 120);
    return () => clearTimeout(t);
  }, [phaseId, fitView]);
  return null;
}

interface PhaseLearningTreeProps {
  curriculum: Curriculum;
  phaseId: string;
  phaseIndex: number;
  allModuleIds: number[];
  moduleSlugMap: Record<number, string[]>;
}

export function PhaseLearningTree({
  curriculum,
  phaseId,
  phaseIndex,
  allModuleIds,
  moduleSlugMap,
}: PhaseLearningTreeProps) {
  const { theme } = useTheme();
  const { isAdmin } = useAuth();
  const isLight = theme === "light";
  const getSlugs = (id: number) => moduleSlugMap[id] ?? [];
  const phase = curriculum.phases.find((p) => p.id === phaseId);
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

  const { nodes, edges } = useMemo(() => {
    const positions = getPhaseTreeLayout(modules, phaseIndex);
    const edgeDefs = getPhaseEdges(modules, phaseIndex);

    const flowNodes: Node[] = [
      {
        id: "phase-header",
        type: "default",
        position: { x: 280, y: -100 },
        data: { label: phase?.title || "Phase" },
        style: {
          background: isLight ? "#ffffff" : "#111",
          border: `2px solid ${color}`,
          borderRadius: 16,
          padding: "16px 24px",
          fontSize: 14,
          fontWeight: 700,
          color: isLight ? "#111827" : "#fff",
          width: 360,
          textAlign: "center",
          pointerEvents: "none",
          boxShadow: isLight
            ? "0 4px 24px rgba(0,0,0,0.08)"
            : "0 4px 24px rgba(0,0,0,0.4)",
        },
        draggable: false,
        selectable: false,
      },
      ...positions.map((pos) => {
        const mod = modules.find((m) => `mod-${m.id}` === pos.id)!;
        const slugsForMod = mod.submodules.map((s) => s.slug);
        const status = getModuleStatus(
          mod.id,
          allModuleIds,
          slugsForMod,
          getSlugs
        );
        const progress = getModuleProgressPercent(mod.id, slugsForMod);
        return {
          id: pos.id,
          type: "moduleCard",
          position: { x: pos.x, y: pos.y },
          data: {
            module: mod,
            status,
            progress,
            href: `/module/${mod.id}`,
            phaseColor: color,
            isLight,
          },
          draggable: false,
        };
      }),
    ];

    const edgeStroke = isLight ? "#94a3b8" : "#444";

    const flowEdges: Edge[] = edgeDefs.map((e, i) => ({
      id: `e-${i}`,
      source: e.source,
      target: e.target,
      type: "smoothstep",
      animated: false,
      style: { stroke: edgeStroke, strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: edgeStroke },
    }));

    if (modules[0]) {
      flowEdges.unshift({
        id: "e-header-first",
        source: "phase-header",
        target: `mod-${modules[0].id}`,
        type: "smoothstep",
        style: { stroke: color, strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color },
      });
    }

    return { nodes: flowNodes, edges: flowEdges };
  }, [
    modules,
    phase,
    phaseIndex,
    phaseId,
    color,
    allModuleIds,
    moduleSlugMap,
    isLight,
    isAdmin,
  ]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.35 }}
        minZoom={0.25}
        maxZoom={1.5}
        panOnScroll
        zoomOnScroll
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color={isLight ? "#d1d5db" : "#1a1a1a"}
          gap={24}
        />
        <Controls
          className={
            isLight
              ? "!border-gray-200 !bg-white [&>button]:!bg-gray-50 [&>button]:!text-gray-800 [&>button]:!border-gray-200"
              : "!bg-[#111] !border-white/10 [&>button]:!bg-[#222] [&>button]:!text-white"
          }
        />
        <MiniMap
          nodeColor={() => color}
          maskColor={isLight ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)"}
          className={
            isLight
              ? "!border-gray-200 !bg-white"
              : "!bg-[#0a0a0a] !border-white/10"
          }
        />
        <FlowCenter phaseId={phaseId} />
      </ReactFlow>
    </div>
  );
}
