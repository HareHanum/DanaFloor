"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Loader2,
  PlayCircle,
  FileText,
  Eye,
} from "lucide-react";
import type { Module, Lesson, LessonAttachment } from "@/types/database";
import LessonEditor from "./LessonEditor";

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

interface ModuleManagerProps {
  courseId: string;
  initialModules: ModuleWithLessons[];
}

// Sortable lesson row
function SortableLessonRow({
  lesson,
  index,
  isEditing,
  attachments,
  onEdit,
  onCloseEdit,
  onDelete,
  onSave,
  lessonTypeIcons,
}: {
  lesson: Lesson;
  index: number;
  isEditing: boolean;
  attachments: LessonAttachment[];
  onEdit: () => void;
  onCloseEdit: () => void;
  onDelete: () => void;
  onSave: (l: Lesson) => void;
  lessonTypeIcons: Record<string, React.ReactNode>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style}>
      {isEditing ? (
        <div>
          <div className="flex items-center justify-between px-4 pt-3">
            <span className="text-xs font-medium text-[var(--text-muted)]">
              עריכת שיעור
            </span>
            <button
              onClick={onCloseEdit}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <ChevronUp size={16} />
            </button>
          </div>
          <LessonEditor
            lesson={lesson}
            attachments={attachments}
            onSave={onSave}
            onCancel={onCloseEdit}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--background)] transition-colors">
          <button
            {...attributes}
            {...listeners}
            className="text-[var(--text-muted)] cursor-grab active:cursor-grabbing touch-none"
          >
            <GripVertical size={14} />
          </button>
          {lessonTypeIcons[lesson.lesson_type] || (
            <FileText size={14} className="text-gray-400" />
          )}
          <button
            onClick={onEdit}
            className="flex-1 text-right text-sm text-[var(--text-primary)] hover:text-[var(--accent)]"
          >
            {index + 1}. {lesson.title}
          </button>
          {lesson.is_preview && (
            <span className="flex items-center gap-1 text-xs text-[var(--accent)]">
              <Eye size={12} />
            </span>
          )}
          {lesson.mux_playback_id && (
            <span className="text-xs text-green-500">וידאו</span>
          )}
          <button
            onClick={onDelete}
            className="p-1 text-red-400 hover:text-red-600 rounded transition-colors"
            title="מחק שיעור"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </li>
  );
}

// Sortable module
function SortableModule({
  mod,
  index,
  children,
}: {
  mod: Module;
  index: number;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: mod.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

export default function ModuleManager({
  courseId,
  initialModules,
}: ModuleManagerProps) {
  const [modules, setModules] = useState(initialModules);
  const [expandedModule, setExpandedModule] = useState<string | null>(
    initialModules[0]?.id ?? null
  );
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [addingModule, setAddingModule] = useState(false);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [lessonAttachments, setLessonAttachments] = useState<
    Record<string, LessonAttachment[]>
  >({});
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  async function loadAttachments(lessonId: string) {
    const { data } = await supabase
      .from("lesson_attachments")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("sort_order");
    setLessonAttachments((prev) => ({
      ...prev,
      [lessonId]: data ?? [],
    }));
  }

  async function addModule() {
    if (!newModuleTitle.trim()) return;
    setAddingModule(true);

    const { data, error } = await supabase
      .from("modules")
      .insert({
        course_id: courseId,
        title: newModuleTitle.trim(),
        sort_order: modules.length,
      })
      .select()
      .single();

    if (!error && data) {
      setModules([...modules, { ...data, lessons: [] }]);
      setNewModuleTitle("");
      setExpandedModule(data.id);
    }
    setAddingModule(false);
  }

  async function deleteModule(moduleId: string) {
    if (!confirm("למחוק את המודול וכל השיעורים שבו?")) return;

    const { error } = await supabase
      .from("modules")
      .delete()
      .eq("id", moduleId);

    if (!error) {
      setModules(modules.filter((m) => m.id !== moduleId));
    }
  }

  async function addLesson(moduleId: string) {
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        module_id: moduleId,
        title: "שיעור חדש",
        lesson_type: "video",
        sort_order:
          modules.find((m) => m.id === moduleId)?.lessons.length ?? 0,
      })
      .select()
      .single();

    if (!error && data) {
      setModules(
        modules.map((m) =>
          m.id === moduleId ? { ...m, lessons: [...m.lessons, data] } : m
        )
      );
      await loadAttachments(data.id);
      setEditingLesson(data.id);
    }
  }

  async function deleteLesson(moduleId: string, lessonId: string) {
    if (!confirm("למחוק שיעור זה?")) return;

    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq("id", lessonId);

    if (!error) {
      setModules(
        modules.map((m) =>
          m.id === moduleId
            ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
            : m
        )
      );
      if (editingLesson === lessonId) setEditingLesson(null);
    }
  }

  function updateLessonInState(moduleId: string, updatedLesson: Lesson) {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === updatedLesson.id ? updatedLesson : l
              ),
            }
          : m
      )
    );
  }

  // Handle module reorder
  async function handleModuleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = modules.findIndex((m) => m.id === active.id);
    const newIndex = modules.findIndex((m) => m.id === over.id);
    const reordered = arrayMove(modules, oldIndex, newIndex);
    setModules(reordered);

    // Persist new order
    for (let i = 0; i < reordered.length; i++) {
      await supabase
        .from("modules")
        .update({ sort_order: i })
        .eq("id", reordered[i].id);
    }
  }

  // Handle lesson reorder within a module
  async function handleLessonDragEnd(moduleId: string, event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const mod = modules.find((m) => m.id === moduleId);
    if (!mod) return;

    const oldIndex = mod.lessons.findIndex((l) => l.id === active.id);
    const newIndex = mod.lessons.findIndex((l) => l.id === over.id);
    const reordered = arrayMove(mod.lessons, oldIndex, newIndex);

    setModules(
      modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: reordered } : m
      )
    );

    // Persist new order
    for (let i = 0; i < reordered.length; i++) {
      await supabase
        .from("lessons")
        .update({ sort_order: i })
        .eq("id", reordered[i].id);
    }
  }

  const lessonTypeIcons: Record<string, React.ReactNode> = {
    video: <PlayCircle size={14} className="text-blue-500" />,
    text: <FileText size={14} className="text-green-500" />,
  };

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleModuleDragEnd}
      >
        <SortableContext
          items={modules.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          {modules.map((mod, i) => (
            <SortableModule key={mod.id} mod={mod} index={i}>
              <div className="border border-[var(--border-light)] rounded-lg overflow-hidden">
                {/* Module header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-[var(--background)]">
                  <ModuleDragHandle moduleId={mod.id} />
                  <button
                    onClick={() =>
                      setExpandedModule(
                        expandedModule === mod.id ? null : mod.id
                      )
                    }
                    className="flex-1 flex items-center gap-2 text-right"
                  >
                    <span className="w-6 h-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="font-medium text-sm">{mod.title}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      ({mod.lessons.length})
                    </span>
                    <ChevronDown
                      size={16}
                      className={`mr-auto text-[var(--text-muted)] transition-transform ${
                        expandedModule === mod.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => deleteModule(mod.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="מחק מודול"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Lessons */}
                {expandedModule === mod.id && (
                  <div className="border-t border-[var(--border-light)]">
                    {mod.lessons.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">
                        אין שיעורים במודול זה
                      </div>
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={(e) => handleLessonDragEnd(mod.id, e)}
                      >
                        <SortableContext
                          items={mod.lessons.map((l) => l.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <ul className="divide-y divide-[var(--border-light)]">
                            {mod.lessons.map((lesson, j) => (
                              <SortableLessonRow
                                key={lesson.id}
                                lesson={lesson}
                                index={j}
                                isEditing={editingLesson === lesson.id}
                                attachments={
                                  lessonAttachments[lesson.id] ?? []
                                }
                                onEdit={async () => {
                                  await loadAttachments(lesson.id);
                                  setEditingLesson(lesson.id);
                                }}
                                onCloseEdit={() => setEditingLesson(null)}
                                onDelete={() =>
                                  deleteLesson(mod.id, lesson.id)
                                }
                                onSave={(updated) =>
                                  updateLessonInState(mod.id, updated)
                                }
                                lessonTypeIcons={lessonTypeIcons}
                              />
                            ))}
                          </ul>
                        </SortableContext>
                      </DndContext>
                    )}

                    <div className="px-4 py-3 border-t border-[var(--border-light)]">
                      <button
                        onClick={() => addLesson(mod.id)}
                        className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
                      >
                        <Plus size={14} />
                        הוסף שיעור
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </SortableModule>
          ))}
        </SortableContext>
      </DndContext>

      {/* Add module */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="text"
          value={newModuleTitle}
          onChange={(e) => setNewModuleTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addModule()}
          placeholder="שם מודול חדש"
          className="flex-1 px-3 py-2 border border-[var(--border-light)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <button
          onClick={addModule}
          disabled={addingModule || !newModuleTitle.trim()}
          className="btn btn-accent py-2 px-4 text-sm disabled:opacity-50"
        >
          {addingModule ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Plus size={16} className="ml-1" />
              הוסף מודול
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Module drag handle (needs useSortable from parent)
function ModuleDragHandle({ moduleId }: { moduleId: string }) {
  const { attributes, listeners } = useSortable({ id: moduleId });
  return (
    <button
      {...attributes}
      {...listeners}
      className="text-[var(--text-muted)] cursor-grab active:cursor-grabbing touch-none"
    >
      <GripVertical size={16} />
    </button>
  );
}
