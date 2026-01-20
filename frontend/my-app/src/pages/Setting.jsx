import React, { useState } from "react";
import "./Setting.css";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  MdPersonOutline,
  MdEdit,
  MdOutlineSecurity,
  MdOutlineContactSupport,
  MdArrowBack
} from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";

const Setting = ({ title, subtitle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRootSettings = location.pathname === "/settings";

  const [currentView, setCurrentView] = useState("main");

  const renderContent = () => {
    /* -------- NOTIFICATIONS -------- */
    if (currentView === "notifications") {
      return (
        <div className="sub-view-container">
          <button className="back-btn" onClick={() => setCurrentView("main")}>
            <MdArrowBack /> Back to Settings
          </button>

          <div className="sub-settings-card">
            <h2 className="view-title">Notifications</h2>
            <p>Notification preferences will go here.</p>
          </div>
        </div>
      );
    }

    /* -------- SECURITY -------- */
    if (currentView === "security") {
      return (
        <div className="sub-view-container">
          <button className="back-btn" onClick={() => setCurrentView("main")}>
            <MdArrowBack /> Back to Settings
          </button>

          <div className="sub-settings-card">
            <h2 className="view-title">Security</h2>

            <div
              className="settings-card"
              style={{ marginTop: "20px" }}
              onClick={() =>
                navigate("/settings/security/update-password")
              }
            >
              <div className="settings-card-header">
                <div className="icon">
                  <MdOutlineSecurity />
                </div>
                <h3>Update Password</h3>
                <MdEdit className="chevron" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    /* -------- HELP -------- */
    if (currentView === "help") {
      return (
        <div className="sub-view-container">
          <button className="back-btn" onClick={() => setCurrentView("main")}>
            <MdArrowBack /> Back to Settings
          </button>

          <div className="sub-settings-card">
            <h2 className="view-title">Help & Support</h2>
            <p>Contact support at +91 98765 43210</p>
          </div>
        </div>
      );
    }

    /* -------- MAIN SETTINGS -------- */
    return (
      <div className="settings-dashboard">
        <div className="settings-header">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <Link to="profile" className="settings-card link-reset">
          <div className="settings-card-header">
            <div className="icon">
              <MdPersonOutline />
            </div>
            <h3>Profile</h3>
            <MdEdit className="chevron" />
          </div>
        </Link>

        <div
          className="settings-card"
          onClick={() => setCurrentView("notifications")}
        >
          <div className="settings-card-header">
            <div className="icon">
              <IoIosNotificationsOutline />
            </div>
            <h3>Notifications</h3>
            <MdEdit className="chevron" />
          </div>
        </div>

        <div
          className="settings-card"
          onClick={() => setCurrentView("security")}
        >
          <div className="settings-card-header">
            <div className="icon">
              <MdOutlineSecurity />
            </div>
            <h3>Security</h3>
            <MdEdit className="chevron" />
          </div>
        </div>

        <div
          className="settings-card"
          onClick={() => setCurrentView("help")}
        >
          <div className="settings-card-header">
            <div className="icon">
              <MdOutlineContactSupport />
            </div>
            <h3>Help & Support</h3>
            <MdEdit className="chevron" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="activity-layout">
      {isRootSettings ? renderContent() : <Outlet />}
    </div>
  );
};

export default Setting;
