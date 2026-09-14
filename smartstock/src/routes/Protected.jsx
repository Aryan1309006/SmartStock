import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Protected = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default Protected;