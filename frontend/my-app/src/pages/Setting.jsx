import "./Setting.css";
import { Link, Outlet, useLocation } from "react-router-dom";

import { MdPersonOutline, MdEdit } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineSecurity } from "react-icons/md";
import { MdOutlineContactSupport } from "react-icons/md";

import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";

function Setting() {
  const location = useLocation();
  const isRootSettings = location.pathname === "/setting";

  return (
    <div className="activity-layout">
      <Sidebar />

      <div className="main-section">
        <Header />

        {/* SETTINGS HOME */}
        {isRootSettings && (
          <div className="settings-dashboard">
            <div className="settings-header">
              <h1>Settings</h1>
              <p>Customize your ToggleNest experience</p>
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

            <div className="settings-card">
              <div className="settings-card-header">
                <div className="icon">
                  <IoIosNotificationsOutline />
                </div>
                <h3>Notifications</h3>
                <MdEdit className="chevron" />
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <div className="icon">
                  <MdOutlineSecurity />
                </div>
                <h3>Security</h3>
                <MdEdit className="chevron" />
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <div className="icon">
                  <MdOutlineContactSupport />
                </div>
                <h3>Help & Support</h3>
              </div>
            </div>
          </div>
        )}

        {/* CHILD ROUTES (PROFILE) */}
        {!isRootSettings && <Outlet />}
      </div>
    </div>
  );
}

export default Setting;
