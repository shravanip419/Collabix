import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff, MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./Setting.css";

const UpdatePassword = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const toggle = (key) => {
    setShow(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      alert("All fields are required 🚨");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      alert("Passwords do not match 😬");
      return;
    }

    alert("Password updated successfully 🎉");
    navigate("/settings");
  };

  return (
    <div className="sub-view-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <MdArrowBack /> Back
      </button>

      <div className="sub-settings-card">
        <h2 className="view-title">Update Password</h2>

        <form className="password-form" onSubmit={handleSubmit}>
          {["current", "new", "confirm"].map((field) => (
            <div className="password-input-wrapper" key={field}>
              <input
                type={show[field] ? "text" : "password"}
                name={field}
                placeholder={
                  field === "current"
                    ? "Current Password"
                    : field === "new"
                    ? "New Password"
                    : "Confirm New Password"
                }
                value={passwords[field]}
                onChange={handleChange}
              />
              <span onClick={() => toggle(field)}>
                {show[field] ? <MdVisibilityOff /> : <MdVisibility />}
              </span>
            </div>
          ))}

          <button type="submit" className="update-btn">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
