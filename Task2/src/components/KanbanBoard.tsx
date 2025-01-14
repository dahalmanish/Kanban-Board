import Plusicon from "../icons/Plusicon";
import { useMemo, useState, useEffect } from "react";
import { Column, Id, Task } from "../type";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, useSensor, PointerSensor, useSensors, DragOverEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 3 }
    }));

    // Load from localStorage on mount
    useEffect(() => {
        const storedColumns = localStorage.getItem("columns");
        const storedTasks = localStorage.getItem("tasks");
        if (storedColumns) setColumns(JSON.parse(storedColumns));
        if (storedTasks) setTasks(JSON.parse(storedTasks));
    }, []);

    // Save to localStorage whenever columns or tasks change
    useEffect(() => {
        localStorage.setItem("columns", JSON.stringify(columns));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [columns, tasks]);

    const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`,
        };
        setTasks([...tasks, newTask]);
    }

    function deleteTask(id: Id) {
        const newTasks = tasks.filter((task) => task.id !== id);
        setTasks(newTasks);
    }

    function updateTask(id: Id, content: string) {
        const newTasks = tasks.map(task => {
            if (task.id !== id) return task;
            return { ...task, content };
        });
        setTasks(newTasks);
    }

    function createNewColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
        };
        setColumns([...columns, columnToAdd]);
    }

    function generateId() {
        return Math.floor(Math.random() * 10001);
    }

    function ondragstart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (!isActiveTask) return;

        if (isActiveTask && isOverATask) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);
                tasks[activeIndex].columnId = tasks[overIndex].columnId;
                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === "Column";

        if (isActiveTask && isOverAColumn) {
            setTasks(tasks => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                tasks[activeIndex].columnId = overId;
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }

    function deleteColumn(id: Id) {
        const filteredColumn = columns.filter(col => col.id !== id);
        setColumns(filteredColumn);

        const newTasks = tasks.filter((t) => t.columnId !== id);
        setTasks(newTasks);
    }

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map(col => {
            if (col.id !== id) return col;
            return { ...col, title };
        });
        setColumns(newColumns);
    }

    function ondragend(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeColumnId = active.id;
        const overColumnId = over.id;

        if (activeColumnId === overColumnId) return;

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId);
            const overColumnIndex = columns.findIndex(col => col.id === overColumnId);
            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }

    return (
        <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
            <DndContext onDragStart={ondragstart} onDragEnd={ondragend} sensors={sensors} onDragOver={onDragOver}>
                <div className="m-auto flex gap-4">
                    {/* Flex container to display columns in a row */}
                    <div className="flex gap-4">
                        <SortableContext items={columnsId}>
                            {columns.map((col) => (
                                <ColumnContainer key={col.id} column={col} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} tasks={tasks.filter((task) => task.columnId === col.id)} deleteTask={deleteTask} updateTask={updateTask} />
                            ))}
                        </SortableContext>
                    </div>
                    <button
                        onClick={createNewColumn}
                        className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2"
                    >
                        <Plusicon />
                        Add Column
                    </button>
                </div>
                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <ColumnContainer column={activeColumn} deleteColumn={deleteColumn} updateColumn={updateColumn} createTask={createTask} tasks={tasks.filter((task) => task.columnId === activeColumn.id)} deleteTask={deleteTask} updateTask={updateTask} />
                        )}
                        {activeTask && (
                            <TaskCard task={activeTask} deleteTask={deleteTask} updateTask={updateTask} />
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
}

export default KanbanBoard;
