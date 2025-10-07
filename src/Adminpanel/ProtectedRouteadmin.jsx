import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { toast } from "react-hot-toast";
import { api } from "/convex/_generated/api.js"; // ✅ import Convex API

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("sessionToken");
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  // ✅ Correct way — skip query if token is missing
  const session = useQuery(api.validatesession.validateSession, token ? { token } : "skip");

  useEffect(() => {
    if (!token) {
      toast.error("No session found. Please log in again.");
      setLoading(false);
      return;
    }

    if (session === undefined) return; // still loading

    if (!session?.valid) {
      localStorage.removeItem("sessionToken");
      toast.error("Session expired. Please log in again.");
    } else {
      setIsValid(true);
    }

    setLoading(false);
  }, [token, session]);

  if (loading) {
    return <div className="text-white text-center mt-10">Checking session...</div>;
  }

  if (!isValid) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
