import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();

  // Wait until Clerk finishes loading
  if (!isLoaded) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  // If loaded and not signed in, redirect
  if (!isSignedIn) {
    toast.error("Please sign in to access this page.");
    return <Navigate to="/employee-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
