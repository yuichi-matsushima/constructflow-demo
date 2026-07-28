"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Customer,
  formatCurrency,
  getStaff,
  priorityColor,
  Project,
  ProjectStatus,
} from "@/lib/mock-data";
import { updateProjectStatus } from "@/app/(app)/projects/actions";
import { cn } from "@/lib/utils";

const columns: ProjectStatus[] = [
  "商談中",
  "契約済み",
  "設計中",
  "施工中",
  "完了",
];

const columnAccent: Record<ProjectStatus, string> = {
  商談中: "border-t-slate-400",
  契約済み: "border-t-blue-500",
  設計中: "border-t-amber-500",
  施工中: "border-t-orange-500",
  完了: "border-t-emerald-500",
};

function ProjectCard({
  project,
  customerName,
  dragging = false,
}: {
  project: Project;
  customerName: string;
  dragging?: boolean;
}) {
  const assignee = getStaff(project.assigneeId);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: `card:${project.id}`, data: { project } });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex flex-col gap-2 rounded-lg border bg-background p-3 text-sm shadow-sm transition-shadow hover:shadow-md",
        (isDragging || dragging) && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/projects/${project.id}`}
          className="min-w-0 flex-1 font-medium hover:underline"
        >
          <span className="line-clamp-2">{project.name}</span>
        </Link>
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="shrink-0 cursor-grab touch-none rounded p-1 text-muted-foreground opacity-0 group-hover:opacity-100 active:cursor-grabbing"
          aria-label="ドラッグして移動"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </div>
      <p className="font-mono text-[11px] text-muted-foreground">
        {project.projectCode}
      </p>
      <p className="text-xs text-muted-foreground">{customerName}</p>
      <div className="flex items-center justify-between gap-2">
        <Badge className={priorityColor[project.priority]} variant="outline">
          {project.priority}
        </Badge>
        <span className="text-xs font-medium">
          {formatCurrency(project.budget)}
        </span>
      </div>
      {assignee && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px]">
              {assignee.avatarInitial}
            </AvatarFallback>
          </Avatar>
          {assignee.name}
        </div>
      )}
    </div>
  );
}

function KanbanColumn({
  status,
  projects,
  customerNameOf,
}: {
  status: ProjectStatus;
  projects: Project[];
  customerNameOf: (id: string) => string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `col:${status}` });
  const total = projects.reduce((sum, p) => sum + p.budget, 0);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 shrink-0 flex-col gap-3 rounded-lg border-t-4 bg-muted/40 p-3",
        columnAccent[status],
        isOver && "bg-accent/60"
      )}
    >
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-semibold">{status}</span>
        <span className="text-xs text-muted-foreground">{projects.length}件</span>
      </div>
      <p className="px-1 text-xs text-muted-foreground">
        {formatCurrency(total)}
      </p>
      <div className="flex min-h-16 flex-col gap-2">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            customerName={customerNameOf(p.customerId)}
          />
        ))}
        {projects.length === 0 && (
          <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
            案件なし
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({
  projects,
  customers,
}: {
  projects: Project[];
  customers: Customer[];
}) {
  const [items, setItems] = useState(projects);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setItems(projects);
  }, [projects]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const customerNameOf = (customerId: string) =>
    customers.find((c) => c.id === customerId)?.name ?? "";

  const handleDragStart = (event: DragStartEvent) => {
    const project = event.active.data.current?.project as Project | undefined;
    setActiveProject(project ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveProject(null);
    const { active, over } = event;
    if (!over) return;
    const projectId = String(active.id).replace("card:", "");
    const newStatus = String(over.id).replace("col:", "") as ProjectStatus;
    const current = items.find((p) => p.id === projectId);
    if (!current || current.status === newStatus) return;

    const previous = items;
    setItems((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
    );
    startTransition(() => {
      updateProjectStatus(projectId, newStatus)
        .then((result) => {
          if (!result.ok) setItems(previous);
        })
        .catch(() => {
          setItems(previous);
        });
    });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-2">
        {columns.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            projects={items.filter((p) => p.status === status)}
            customerNameOf={customerNameOf}
          />
        ))}
      </div>
      <DragOverlay>
        {activeProject && (
          <ProjectCard
            project={activeProject}
            customerName={customerNameOf(activeProject.customerId)}
            dragging
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
