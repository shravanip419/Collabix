import "./Board.css";
import Sidebar from "./Sidebar";
import Header from "./Header";

const tasks = [
  {
    _id: "1",
    title: "Design system documentation",
    status: "todo",
    priority: "high",
    dueDate: "Jan 20"
  },
  {
    _id: "2",
    title: "User authentication flow",
    status: "in-progress",
    priority: "urgent",
    dueDate: "Jan 18"
  },
  {
    _id: "3",
    title: "Analytics dashboard",
    status: "in-progress",
    priority: "high",
    dueDate: "Jan 24"
  },
  {
    _id: "4",
    title: "Homepage hero section",
    status: "done",
    priority: "high",
    dueDate: "Jan 15"
  }
];

const Card = ({ task }) => (
  <div className="card">
    <h4>{task.title}</h4>

    <span className={`priority ${task.priority}`}>
      {task.priority}
    </span>

    <div className="card-footer">
      <span>{task.dueDate}</span>
    </div>
  </div>
);

const Column = ({ title, status }) => {
  const filteredTasks = tasks.filter(task => task.status === status);

  return (
    <div className="column">
      <div className="column-header">
        <h3>{title}</h3>
      </div>

      {filteredTasks.map(task => (
        <Card key={task._id} task={task} />
      ))}
    </div>
  );
};

const Board = () => {
  return (
    <div className="activity-layout">
      <Sidebar />

      <div className="main-section">
        <Header/>
        <div className="board">
          <Column title="To Do" status="todo" />
          <Column title="In Progress" status="in-progress" />
          <Column title="Done" status="done" />
        </div>
      </div>
    </div>
  );
};

export default Board;
