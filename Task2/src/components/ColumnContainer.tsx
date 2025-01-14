import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import { Column, Id, Task } from "../type";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import Plusicon from "../icons/Plusicon";
import TaskCard from "./TaskCard";
import { useMemo } from "react";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content:string) => void;
  deleteTask: (id: Id) => void;

  tasks: Task[];
}

function ColumnContainer(props: Props) {
    const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask} = props;
    const [editMode, setEditMode] = useState(false);

    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    },[tasks]);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if(isDragging){
        return <div ref={setNodeRef} style={style}  className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-lg flex flex-col border-2 border-rose-500 opacity-40"></div>;
    }

    return (
        <div ref={setNodeRef}
            style={style}
            className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-lg flex flex-col">
            {/* Column Header */}
            <div
                {...attributes}
                {...listeners}
                onClick={()=>{
                    setEditMode(true);
                }}
                className="bg-mainBackgroundColor h-[60px] cursor-grab rounded-mb rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center relative">
                <div className="flex gap-2">
                    <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">0</div>
                    {!editMode && column.title}
                    {editMode && <input className="bg-black focus:border-rose-500 border rounded outline-none px-2" 
                    onChange={(e) => updateColumn(column.id,e.target.value)}
                    autoFocus placeholder="Enter col name" title="v" value={column.title} onBlur={()=>{
                        setEditMode(false);
                    }}
                    onKeyDown={(e) =>{
                        if(e.key !== "Enter") return;
                        setEditMode(false);
                    }}
                    />}

                </div>

                {/* Delete button positioned to the top right */}
                <button 
                    title="Delete"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent drag event propagation
                        deleteColumn(column.id);
                    }}
                    className="absolute top-2 right-2 stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2">
                    <TrashIcon />
                </button>
            </div>

            {/* Column Task Container - This will take up the available space */}
            <div className="flex flex-grow overflow-x-hidden overflow-y-auto p-2 flex-col gap-4">
                <SortableContext items={tasksIds}>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
                ))}
                </SortableContext>
            </div>

            {/* Column Footer - Keep it fixed at the bottom */}
             <button 
             onClick={() => {
                createTask(column.id);
             }}
             className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:text-rose-500 active:bg-black">
                <Plusicon/>
                Add task
                </button>
        </div>
    );
}

export default ColumnContainer;
