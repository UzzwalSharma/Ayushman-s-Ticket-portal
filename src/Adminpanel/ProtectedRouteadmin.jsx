import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "convex/react";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("sessionToken");
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [redirectMsg, setRedirectMsg] = useState("");

  // Skip query if no token
  const session = useQuery(
    token ? "validatesession:validateSession" : null,
    token ? { token } : undefined
  );

  useEffect(() => {
    // No token stored
    if (!token) {
      setRedirectMsg("No session found. Redirecting to login...");
      setLoading(false);
      return;
    }

    if (session === undefined) return; // still loading

    if (!session.valid) {
      localStorage.removeItem("sessionToken");
      setRedirectMsg("Session expired or invalid. Redirecting to login...");
    } else {
      setIsValid(true);
    }

    setLoading(false);
  }, [token, session]);

  if (loading) {
    return <div className="text-white text-center mt-10">Checking session...</div>;
  }

  if (!isValid) {
    return (
      <div className="text-white text-center mt-10">
        {redirectMsg}
        <Navigate to="/admin-login" replace />
      </div>
    );
  }

  return children;
}
