import "./Board.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskForm from "./TaskForm";

const Board = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formStatus, setFormStatus] = useState("todo");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://localhost:5000/api/tasks?projectId=${projectId}`)
      .then(res => res.json())
      .then(setTasks);
  }, [projectId]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    setTasks(prev =>
      prev.map(task =>
        task._id === draggableId ? { ...task, status: newStatus } : task
      )
    );

    await fetch(`http://localhost:5000/api/tasks/${draggableId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: newStatus,
        user: { name: user?.name },
      }),
    });
  };

  const handleSaveTask = async (taskData) => {
    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...taskData,
        projectId,
        user: { name: user?.name },
      }),
    });

    const savedTask = await res.json();
    setTasks(prev => [...prev, savedTask]);
    setShowForm(false);
  };

  return (
    <div className="board-wrapper">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          <Column title="To Do" status="todo" tasks={tasks} onAdd={() => {
            setFormStatus("todo"); setShowForm(true);
          }} />
          <Column title="In Progress" status="in-progress" tasks={tasks} onAdd={() => {
            setFormStatus("in-progress"); setShowForm(true);
          }} />
          <Column title="Done" status="done" tasks={tasks} onAdd={() => {
            setFormStatus("done"); setShowForm(true);
          }} />
        </div>
      </DragDropContext>

      {showForm && (
        <TaskForm
          defaultStatus={formStatus}
          onClose={() => setShowForm(false)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

const Column = ({ title, status, tasks, onAdd }) => {
  const filtered = tasks.filter(t => t.status === status);

  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className="column">
          <div className="column-header">
            <h3>{title}</h3>
            <button className="add-btn" onClick={onAdd}>+</button>
          </div>

          {filtered.map((task, index) => (
            <Draggable key={task._id} draggableId={task._id} index={index}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  <Card task={task} />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

const Card = ({ task }) => (
  <div className="card">
    <h4>{task.title}</h4>
    <span className={`priority ${task.priority}`}>{task.priority}</span>
    <div className="card-footer">
      <span>{task.dueDate}</span>
    </div>
  </div>
);

export default Board;
