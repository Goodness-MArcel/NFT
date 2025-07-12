// src/privateRoute.jsx
import React from "react";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
