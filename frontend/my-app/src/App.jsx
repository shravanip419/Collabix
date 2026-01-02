import Board from "./pages/Board.jsx";
import Activity from "./pages/Activity.jsx";
import Setting from "./pages/Setting.jsx";
import Profile from "./pages/Profile.jsx";
import "./App.css";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Board />} />
      <Route path="/activity" element={<Activity />} />

      {/* SETTINGS LAYOUT */}
      <Route path="/setting" element={<Setting />}>
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
