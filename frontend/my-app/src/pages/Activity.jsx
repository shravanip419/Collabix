import { useEffect, useState } from "react";
import "./Activity.css";

function Activity() {
  const [activities, setActivities] = useState([]);
  const projectId = localStorage.getItem("activeProjectId");

  useEffect(() => {
    if (!projectId) return;

    fetch(`http://localhost:5000/api/activities?projectId=${projectId}`)
      .then(res => res.json())
      .then(setActivities);
  }, [projectId]);

  if (!projectId) {
    return (
      <div className="activities">
        <p style={{ textAlign: "center", color: "#888" }}>
          Please select a project to view activities
        </p>
      </div>
    );
  }

  const activityIcon = (type) => {
    if (type === "completed") return "✅";
    if (type === "assigned") return "👤";
    if (type === "updated") return "✏️";
    if (type === "created") return "🆕";
  };

  // 🔥 FIXED TEXT FORMAT
  const getTitle = (activity) => {
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
    <div className="activities">
      {activities.map((activity) => (
        <div key={activity._id} className="activity-card">
          <div className="activity-type">
            {activityIcon(activity.type)}
          </div>

          <div className="activity-details">
            <div className="activity-img">
              <img
                src={activity.user?.avatar || "https://i.pravatar.cc/150"}
                alt={activity.user?.name}
                className="activity-user-image"
              />
            </div>

            <div className="activity_details">
              <p className="activity-user-name">
                {getTitle(activity)}
              </p>

              <p className="activity-action">
                {activity.message}
              </p>
            </div>

            <div className="activity-time">
              {new Date(activity.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Activity;
