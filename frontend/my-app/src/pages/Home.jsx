import { useEffect, useState } from "react";
import "./Home.css";

const Home = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/activities/recent?limit=5")
      .then((res) => res.json())
      .then(setActivities)
      .catch(console.error);
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

        {/* STATS CARDS */}
        <section className="stats">
          <div className="stat-card stat-purple">
            <div className="stat-info">
              <h4>Total Projects</h4>
              <h1>3</h1>
            </div>
            <div className="stat-icon">📁</div>
          </div>
        </section>

        {/* GRID SECTION */}
        <section className="grid">

          {/* YOUR PROJECTS */}
          <div className="panel">
            <div className="panel-header">
              <h3>Your Projects</h3>
              <a href="#">View all</a>
            </div>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="panel">
            <div className="panel-header">
              <h3>Recent Activity</h3>
              <a href="#">View all</a>
            </div>

            {activities.map((activity) => (
              <div key={activity._id} className="activity">
                <strong>{getActivityText(activity)}</strong>
                <div style={{ fontSize: "12px", color: "#777" }}>
                  {activity.projectName}
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
