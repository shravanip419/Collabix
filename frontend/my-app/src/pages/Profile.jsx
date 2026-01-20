import { useEffect, useState } from "react";
import "./Profile.css";
import {
  MdWork,
  MdApartment,
  MdBusiness,
  MdLocationOn,
  MdEmail
} from "react-icons/md";
import JiraLogo from "../Logo/Jira.png";
import api from "../api/axios";

export default function Profile() {
  const [expanded, setExpanded] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // 🔥 Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/users/me");
      setUser(res.data.user);
      setTasks(res.data.tasks || []);
      setFormData(res.data.user); // preload form
    };
    fetchProfile();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      const res = await api.put("/users/me", {
        jobTitle: formData.jobTitle,
        department: formData.department,
        organization: formData.organization,
        location: formData.location
      });

      setUser(res.data); // update UI
      setEditMode(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!user) return <p style={{ padding: "30px" }}>Loading profile...</p>;

  const tasksToShow = expanded ? tasks : tasks.slice(0, 5);

  return (
    <div className="profile-root">
      {/* COVER */}
      <div className="profile-cover">
        <div className="cover-overlay">
          <button className="cover-btn">Add cover image</button>
        </div>
      </div>

      <div className="profile-content">
        {/* LEFT */}
        <div className="profile-left">
          <div className="avatar-wrapper">
            <div className="avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <h2 className="profile-name">{user.name}</h2>

          <button
            className="manage-account"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Manage your account"}
          </button>

          {/* ABOUT */}
          <div className="profile-card">
            <h3>About</h3>

            {/* JOB */}
            <div className="about-item">
              <MdWork />
              {editMode ? (
                <input
                  name="jobTitle"
                  value={formData.jobTitle || ""}
                  onChange={handleChange}
                  placeholder="Job title"
                />
              ) : (
                <span>{user.jobTitle || "Add job title"}</span>
              )}
            </div>

            {/* DEPARTMENT */}
            <div className="about-item">
              <MdApartment />
              {editMode ? (
                <input
                  name="department"
                  value={formData.department || ""}
                  onChange={handleChange}
                  placeholder="Department"
                />
              ) : (
                <span>{user.department || "Add department"}</span>
              )}
            </div>

            {/* ORG */}
            <div className="about-item">
              <MdBusiness />
              {editMode ? (
                <input
                  name="organization"
                  value={formData.organization || ""}
                  onChange={handleChange}
                  placeholder="Organization"
                />
              ) : (
                <span>{user.organization || "Add organization"}</span>
              )}
            </div>

            {/* LOCATION */}
            <div className="about-item">
              <MdLocationOn />
              {editMode ? (
                <input
                  name="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                  placeholder="Location"
                />
              ) : (
                <span>{user.location || "Add location"}</span>
              )}
            </div>

            <div className="divider" />

            {/* CONTACT */}
            <h4 className="sub-title">Contact</h4>
            <div className="about-item">
              <MdEmail /> <span>{user.email}</span>
            </div>

            {editMode && (
              <button
                className="manage-account"
                style={{ marginTop: "12px" }}
                onClick={saveProfile}
              >
                Save changes
              </button>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="profile-right">
          <div className="worked-on-box">
            <div className="worked-header">
              <h3>Worked on</h3>
            </div>

            <div className="worked-list">
              {tasksToShow.length === 0 ? (
                <p style={{ fontSize: "14px", color: "#6b778c" }}>
                  No tasks yet.
                </p>
              ) : (
                tasksToShow.map(task => (
                  <div key={task._id} className="worked-item">
                    <span className="check">✓</span>
                    <div>
                      <p>{task.title}</p>
                      <span className="worked-meta">
                        {new Date(task.createdAt).toDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {tasks.length > 5 && (
              <button
                className="show-more-btn"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>

          <div className="profile-card places">
            <h3>Places you work in</h3>
            <div className="jira-place">
              <div className="jira-row">
                <img src={JiraLogo} alt="Jira" className="jira-icon" />
                <span className="jira-title">JIRA</span>
              </div>
              <p className="jira-project">My Software Team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
