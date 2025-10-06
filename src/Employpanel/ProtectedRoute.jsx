// ProtectedRoute.jsx
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn } = useUser();

  if (!isSignedIn) {
    toast.error("Please sign in to access this page.");
    // Redirect to employee login if not authenticated
    return <Navigate to="/employee-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
