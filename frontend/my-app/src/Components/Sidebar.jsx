import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";

import dashboardIcon from "../assets/Dashboard.png";
import activityIcon from "../assets/Activity.png";
import settingsIcon from "../assets/Settings.png";

import ProjectForm from "../pages/ProjectForm";

const Sidebar = () => {
  const location = useLocation();

  const expandedRoutes = ["/home"];
  const isExpandedRoute = expandedRoutes.includes(location.pathname);

  const [collapsed, setCollapsed] = useState(!isExpandedRoute);
  const [manualToggle, setManualToggle] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);

useEffect(() => {
  if (!manualToggle) {
    setCollapsed(!isExpandedRoute);
  }
}, [location.pathname, isExpandedRoute, manualToggle]);

  // FETCH PROJECTS
  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then(res => res.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(prev => !prev);
    setManualToggle(true);
  };

  // SAVE PROJECT
  const saveProject = async (name) => {
    const res = await fetch("http://localhost:5000/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    const project = await res.json();
    setProjects(prev => [...prev, project]);
    setShowProjectForm(false);
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* TOP */}
      <div className="sidebar-top">
        <div className="brand">
          <div className="logo">T</div>
          {!collapsed && <span>ToggleNest</span>}
        </div>

        <button className="collapse-toggle" onClick={toggleSidebar}>
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* NAV */}
      <nav className="nav">
        <NavLink to="/home" className="nav-item">
          <img src={dashboardIcon} alt="Dashboard" />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/activity" className="nav-item">
          <img src={activityIcon} alt="Activity" />
          {!collapsed && <span>Activity</span>}
        </NavLink>

        <NavLink to="/settings" className="nav-item">
          <img src={settingsIcon} alt="Settings" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
      </nav>

      {/* PROJECTS */}
      {!collapsed && (
        <div className="projects">
          <div className="projects-header">
            <span>PROJECTS</span>
            <button
              className="add-project-btn"
              onClick={() => setShowProjectForm(true)}
            >
              ＋
            </button>
          </div>

          {showProjectForm && (
            <ProjectForm
              onSave={saveProject}
              onCancel={() => setShowProjectForm(false)}
            />
          )}

          {/* ✅ IMPORTANT CHANGE HERE */}
          {projects.map(project => (
            <NavLink
              key={project._id}
              to={`/board/${project._id}`}
              className="project-item"
              onClick={() => {
                localStorage.setItem("activeProjectId", project._id);
                localStorage.setItem("activeProjectName", project.name);
              }}
            >
              <span className="dot blue" />
              {project.name}
            </NavLink>
          ))}
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
