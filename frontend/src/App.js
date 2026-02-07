import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import KanbanBoard from "./pages/KanbanBoard";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔑 ROOT */}
        <Route
          path="/"
          element={
            loggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 🔐 LOGIN */}
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={() => setLoggedIn(true)} />
            )
          }
        />

        {/* 🆕 REGISTER */}
        <Route
          path="/register"
          element={
            loggedIn ? (
              <Navigate to="/dashboard" />
            ) : (
              <Register />
            )
          }
        />

        {/* 📊 DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            loggedIn ? <Dashboard /> : <Navigate to="/login" />
          }
        />

        {/* 📌 PROJECT KANBAN */}
        <Route
          path="/projects/:projectId"
          element={
            loggedIn ? <KanbanBoard /> : <Navigate to="/login" />
          }
        />

        {/* ❌ FALLBACK */}
        <Route
          path="*"
          element={
            <Navigate to={loggedIn ? "/dashboard" : "/login"} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
