import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [activities, setActivities] = useState([]);
  const [projects, setProjects] = useState([]);

 useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("❌ No token found");
    return;
  }

  // Fetch projects
  fetch("http://localhost:5000/api/projects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(data => {
      setProjects(Array.isArray(data) ? data : []);
    })
    .catch(err => {
      console.error("Projects error:", err);
      setProjects([]); // 👈 prevent crash
    });

  // Fetch activities
  fetch("http://localhost:5000/api/activities/recent?limit=5", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => setActivities(Array.isArray(data) ? data : []))
    .catch(() => setActivities([]));
}, []);


  const getActivityText = (activity) => {
    const name = activity.user?.name || "Someone";
    const task = activity.taskTitle || "a task";

    switch (activity.type) {
      case "created":
        return `${name} created ${task}`;
      case "completed":
        return `${name} completed ${task}`;
      case "assigned":
        return `${name} assigned ${task}`;
      default:
        return `${name} updated ${task}`;
    }
  };

  return (
    <div className="home">
      <div className="dashboard">

        {/* STATS */}
        <section className="stats">
          <div className="stat-card stat-purple">
            <div className="stat-info">
              <h4>Total Projects</h4>
              <h1>{projects.length}</h1>
            </div>
            <div className="stat-icon">📁</div>
          </div>
        </section>

        {/* GRID */}
        <section className="grid">

          {/* YOUR PROJECTS */}
          <div className="panel">
            <div className="panel-header">
              <h3>Your Projects</h3>
              <Link to="/projects">View all</Link>
            </div>

            {projects.slice(0, 3).map(project => (
              <div key={project._id} className="project-item">
                <strong>{project.name}</strong>
                <p>{project.description || "No description"}</p>
              </div>
            ))}
          </div>

          {/* RECENT ACTIVITY */}
          <div className="panel">
            <div className="panel-header">
              <h3>Recent Activity</h3>
              <Link to="/activity">View all</Link>
            </div>

            {activities.length === 0 && (
              <p style={{ color: "#888" }}>No recent activity</p>
            )}

            {activities.map(activity => (
              <div key={activity._id} className="activity">
                <strong>{getActivityText(activity)}</strong>
                <div className="activity-meta">
                  {activity.projectName || "General"}
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
