import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Ticket, PlusCircle, User, User2Icon } from "lucide-react"; // Add icons

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to highlight active nav
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gray-800 text-white px-6 py-4 shadow-lg border-b-2 border-yellow-400">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <img src="/logoart.png" alt="" srcset="" />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg text-yellow-400">Ayushmaan</span>
              <span className="font-bold text-lg text-white">Solutions</span>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8 font-medium">
            <button
              className={`flex cursor-pointer items-center gap-2 transition pb-1 ${
                isActive("/Mytickets")
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "hover:text-yellow-400"
              }`}
              onClick={() => navigate("/Mytickets")}
            >
              <Ticket className="w-5 h-5" />
              My Tickets
            </button>
            <button
              className={`flex cursor-pointer items-center gap-2 transition pb-1 ${
                isActive("/Mainscreen")
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "hover:text-yellow-400"
              }`}
              onClick={() => navigate("/Mainscreen")}
            >
              <PlusCircle className="w-5 h-5" />
              Raise Ticket
            </button>
            <button
              className={`flex items-center cursor-pointer gap-2 transition pb-1 ${
                isActive("/Myprofile")
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "hover:text-yellow-400"
              }`}
              onClick={() => navigate("/Myprofile")}
            >
              <User2Icon className="w-5 h-5" />
              Profile
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
