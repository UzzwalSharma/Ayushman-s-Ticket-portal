import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ChooseRole from "../Auth/Role.jsx";
import Mainscreen from "./Employpanel/Mainscreen.jsx";
import Login from "../Auth/Login.jsx";
import AdminLogin from "./Adminpanel/Adminlogin.jsx";
import AdminDashboard from "./Adminpanel/Dashboard.jsx";
import MyTickets from "./Employpanel/Mytickets.jsx";
import MyProfile from "./Employpanel/Profile.jsx";
import Layout from "./Employpanel/Outlet.jsx";
import ProtectedRoute from "./Employpanel/ProtectedRoute.jsx"; 
import ProtectedRouteadmin from "./Adminpanel/ProtectedRouteadmin.jsx";

function App() {
  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          success: { style: { background: "#10B981", color: "white" } },
          error: { style: { background: "#EF4444", color: "white" } },
          loading: { style: { background: "#F59E0B", color: "white" } },
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<ChooseRole />} />

      
          <Route element={<Layout />}>
            <Route
              path="/Mainscreen"
              element={
                <ProtectedRoute>
                  <Mainscreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Mytickets"
              element={
                <ProtectedRoute>
                  <MyTickets />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Myprofile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/employee-login" element={<Login />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          <Route path="/admindashboard" element={
            <ProtectedRouteadmin>
              <AdminDashboard />
            </ProtectedRouteadmin>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
