import { useState } from "react";
import "./Profile.css";
import {
  MdWork,
  MdApartment,
  MdBusiness,
  MdLocationOn,
  MdEmail
} from "react-icons/md";
import JiraLogo from "../Logo/Jira.png";


export default function Profile() {
  const [expanded, setExpanded] = useState(false);

  const baseTasks = [
    "Finalize Documentation for the Project",
    "Optimize Performance of the Application",
    "Develop Transaction History Feature",
    "Create Wallet Integration",
    "Set Up Notifications for Users"
  ];

  const extraTasks = [
    "Implement User Authentication",
    "Subtask 2.1",
    "Post-Launch Review and Feedback Collection",
    "Prepare for Project Launch",
    "Conduct User Testing for the Platform"
  ];

  const tasksToShow = expanded ? [...baseTasks, ...extraTasks] : baseTasks;

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
          {/* AVATAR */}
          <div className="avatar-wrapper">
            <div className="avatar">
              KD
              <span className="avatar-overlay">Change</span>
            </div>
          </div>

          <h2 className="profile-name">Kaustubh Deshmane</h2>
          <button className="manage-account">Manage your account</button>

          {/* ABOUT */}
          <div className="profile-card">
            <h3>About</h3>

            <div className="about-item">
              <MdWork /> <span>Your job title</span>
            </div>
            <div className="about-item">
              <MdApartment /> <span>Your department</span>
            </div>
            <div className="about-item">
              <MdBusiness /> <span>Your organization</span>
            </div>
            <div className="about-item">
              <MdLocationOn /> <span>Your location</span>
            </div>

            <div className="divider" />

            {/* CONTACT */}
            <h4 className="sub-title">Contact</h4>
            <div className="about-item">
              <MdEmail /> <span>kaustubhdexhmane123@gmail.com</span>
            </div>

            <div className="divider" />

            {/* TEAMS */}
            <h4 className="sub-title">Teams</h4>
            <div className="team-box">
              <span className="plus">+</span>
              <span>Create a team</span>
            </div>

            <a className="privacy-link">View privacy policy</a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="profile-right">
          {/* WORKED ON */}
          <div className="worked-on-box">
            <div className="worked-header">
              <h3>Worked on</h3>
              <span className="view-all">View all</span>
            </div>

            <p className="worked-subtext">
              Others will only see what they can access.
            </p>

            <div className="worked-list">
              {tasksToShow.map((task, i) => (
                <div key={i} className="worked-item">
                  <span className="check">✓</span>
                  <div>
                    <p>{task}</p>
                    <span className="worked-meta">
                      (Example) Billing System Dev · You created this on January 2, 2026
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="show-more-btn"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          </div>

          {/* PLACES */}
          <div className="profile-card places">
            <h3>Places you work in</h3>

            <div className="jira-place">
              <div className="jira-row">
                <img src={JiraLogo} alt="Jira" className="jira-icon" />
                <span className="jira-title">JIRA</span>
              </div>
              <p className="jira-project">Billing System Dev</p>
            </div>

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
