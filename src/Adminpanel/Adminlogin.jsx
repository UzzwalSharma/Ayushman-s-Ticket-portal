import React, { useState } from "react";
import { LogIn, ArrowRight, CheckCircle2, ArrowRightFromLine } from "lucide-react";
import { useMutation } from "convex/react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("adminLoggedIn")
  );
  const [error, setError] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = useMutation("auth:login");
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await login({ email: email.trim(), password: password.trim() });

    if (res.success) {
      
      localStorage.setItem("adminLoggedIn", "true");
      localStorage.setItem("sessionToken", res.token);
      setIsAuthenticated(true);
      toast.success("Welcome back!");
      navigate("/admindashboard");
    } else {
      toast.error(res.error || "Invalid email or password");
      setPassword(""); // optional: clear password
    }
  } catch (err) {
    toast.error(err?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("sessionToken");
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-gray-800 text-white px-4 sm:px-6 py-4 shadow-lg border-b-2 border-yellow-400 relative z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
           <Link to="/"> <div className="w-9 h-9 sm:w-10 sm:h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <img src="/logoart.png" className="rounded-sm" alt="logo" srcset="" />
            </div> </Link>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-bold text-base sm:text-lg text-yellow-400 leading-tight">
                Ayushman
              </span>
              <span className="font-bold text-base sm:text-lg text-white sm:ml-1 leading-tight">
                Solutions
              </span>
            </div>
          </div>

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex cursor-pointer
               items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <ArrowRightFromLine className="w-5 h-5" />
              <span className="tracking-wide">Logout</span>
            </button>
          )}
        </div>
      </header>

      {/* Split Screen */}
      <main className="flex flex-1 h-full overflow-hidden">
        {/* Left Image */}
        <div className="hidden lg:flex w-1/2 relative bg-white p-8 overflow-hidden">
          <div className="w-full h-full border-4 border-yellow-400 rounded-3xl overflow-hidden relative">
            <img
              src="/adminlogin.jpeg"
              alt="Admin team"
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setIsImageLoaded(true)}
              onError={(e) => {
                e.target.style.display = "none";
                setIsImageLoaded(true);
              }}
            />
          </div>
        </div>

        {/* Right Form */}
        <div className="flex flex-col w-full lg:w-1/2 items-center justify-center p-6 sm:p-8 bg-gray-50 h-full overflow-hidden">
          {!isAuthenticated ? (
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                  Welcome to{" "}
                  <span className="text-yellow-500 block">Ayushman Solutions</span>
                </h1>
                <p className="text-gray-600 text-lg">Admin Portal</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-200">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-left text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <label className="block text-left text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm font-medium">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full cursor-pointer flex items-center justify-center space-x-3 bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl group ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    <LogIn className="w-5 h-5" />
                    {loading ? "Signing In..." : "Sign In to Continue"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl p-10 sm:p-12 text-center border border-gray-200">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle2 className="w-14 h-14 text-green-600" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  Welcome Back!
                </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-8">
                  Access the admin dashboard{" "}
                  <span className="font-semibold text-yellow-600">
                    Manage all tickets & employees
                  </span>
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/admindashboard")}
                    className="cursor-pointer w-full flex items-center justify-center space-x-2 bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminLogin;
