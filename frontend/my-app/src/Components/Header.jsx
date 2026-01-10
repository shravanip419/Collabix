import "./Header.css";
import { useState, useEffect } from "react"; 

const Header = ({title, subtitle}) => {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const darkMode = savedTheme === 'dark';
    setIsDark(darkMode);
    document.documentElement.classList.toggle('dark', darkMode);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="header-wrapper">
    <header className="topbar">
      <div className="header-info">
        <h1>{title}</h1>
        <p className="sub">{subtitle}</p>
      </div>

      <div className="header-right">
        <div className="search-box">
          🔍<input type="text" className="search-input" placeholder="Search tasks..." />
        </div>

        <button className="theme-btn" onClick={toggleTheme}>
          {isDark ? '☀️' : '🌙'}
        </button>

        <div className="notification-btn">
          🔔<span className="notif-dot"></span>
        </div>
      </div>
    </header>
    </div>
  );
};

export default Header;