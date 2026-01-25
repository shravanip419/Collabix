import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

import api from "../api/axios";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [activities, setActivities] = useState([]);

  const [stats, setStats] = useState({
    totalProjects: 0,
    completed: 0,
    pending: 0,
    productivity: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, tasksRes, activityRes] = await Promise.all([
          api.get("/projects"),
          api.get("/tasks/dashboard/all"),
          api.get("/activities/recent?limit=5"),
        ]);

        const projectsData = projectsRes.data;
        const tasks = tasksRes.data;
        const activitiesData = activityRes.data;

        setProjects(projectsData);

        const completedTasks = tasks.filter(t => t.status === "done");
        const pendingTasks = tasks.filter(t => t.status !== "done");

        const productivity =
          tasks.length === 0
            ? 0
            : Math.round((completedTasks.length / tasks.length) * 100);

        setStats({
          totalProjects: projectsData.length,
          completed: completedTasks.length,
          pending: pendingTasks.length,
          productivity,
        });

        setActivities(activitiesData);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      }
    };

    fetchDashboardData();
  }, []);

  const getActivityText = (activity) => {
    const name = activity.user?.name || "Someone";

    if (activity.type === "created")
      return `${name} created ${activity.taskTitle}`;

    if (activity.type === "completed")
      return `${name} completed ${activity.taskTitle}`;

    if (activity.type === "assigned")
      return `${name} assigned ${activity.taskTitle}`;

    return `${name} updated ${activity.taskTitle}`;
  };

  return (
    <div className="home">
      <div className="dashboard">

        <section className="stats">

          <div className="stat-card stat-purple">
            <div className="stat-info">
              <h4>Total Projects</h4>
              <h1>{stats.totalProjects}</h1>
            </div>
            <div className="stat-icon">📁</div>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-info">
              <h4>Tasks Completed</h4>
              <h1>{stats.completed}</h1>
              <span>↑ productivity based</span>
            </div>
            <div className="stat-icon">✅</div>
          </div>

          <div className="stat-card stat-yellow">
            <div className="stat-info">
              <h4>Tasks Pending</h4>
              <h1>{stats.pending}</h1>
            </div>
            <div className="stat-icon">⏳</div>
          </div>

          <div className="stat-card stat-blue">
            <div className="stat-info">
              <h4>Team Productivity</h4>
              <h1>{stats.productivity}%</h1>
              <span>Based on completed tasks</span>
            </div>
            <div className="stat-icon">📈</div>
          </div>

        </section>

        <section className="grid">

          <div className="panel">
            <div className="panel-header">
              <h3>Your Projects</h3>
              <Link to="/board" className="view-all">View all</Link>
            </div>

            {projects && projects.slice(0, 3).map(project => (
              <div key={project._id} className="project-item">
                <strong>{project.name}</strong>
                <p>{project.description || "No description"}</p>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Recent Activity</h3>
              <Link to="/activity" className="view-all">View all</Link>
            </div>

            {activities.length === 0 && (
              <p style={{ color: "#888" }}>No recent activity</p>
            )}

           {activities.map(activity => (
  <div key={activity._id} className="activity-item">

    <img
      src={activity.user?.avatar || "https://i.pravatar.cc/100"}
      alt="user"
      className="activity-avatar"
    />

    <div className="activity-content">

      <p className="activity-text">
        <strong>{getActivityText(activity)}</strong>
      </p>

      <span className="activity-project">
        {activity.projectName || "General"}
      </span>

    </div>

  </div>
))}



          </div>

        </section>

      </div>
    </div>
  );
};

export default Home;
