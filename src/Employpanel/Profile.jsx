import { useUser, UserButton } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { Mail, Phone, User, Calendar, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";

function MyProfile() {
  const { user } = useUser();

  // Fetch user info from tickets table
  const tickets = useQuery(
    "getMyTickets:getMyTickets",
    user?.primaryEmailAddress?.emailAddress
      ? { reporterEmail: user.primaryEmailAddress.emailAddress }
      : "skip"
  );

  if (!user) {
    return (
      <div className="min-h-screen ">
        
        <header className="bg-gray-800 text-white px-6 py-4 shadow-lg border-b-2 border-yellow-400">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-gray-900 font-black text-lg">AS</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg text-yellow-400">Ayushmaan</span>
                <span className="font-bold text-lg text-white">Solutions</span>
              </div>
            </div>
          </div>
        </header>
         <div className="absolute inset-0 -z-10">
        <img
          src="/rolebg.jpeg"
          alt="Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/50" />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <p className="text-gray-500">Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  if (tickets === undefined) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gray-800 text-white px-6 py-4 shadow-lg border-b-2 border-yellow-400">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="text-gray-900 font-black text-lg">AS</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-lg text-yellow-400">Ayushmaan</span>
                <span className="font-bold text-lg text-white">Solutions</span>
              </div>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get user info from first ticket (fallback if no ticket, use Clerk info)
  const info = tickets[0] || {};
  const name = info.reporterName || user.fullName || "Unknown";
  const email = info.reporterEmail || user.primaryEmailAddress?.emailAddress;
  const phone = info.reporterContact || user.phoneNumbers?.[0]?.phoneNumber || "Not set";
  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "N/A";

  // Calculate ticket stats
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in-progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Decorative circular images */}
      <img
        src="/rolebg.jpeg"
        alt="Decorative"
        className="absolute sm:block hidden top-24  left-8 w-48 h-48 rounded-full object-cover shadow-lg z-0"
        style={{ border: "4px solid #FBBF24" }}
      />
      <img
        src="/illustration3.jpeg"
        alt="Decorative"
        className="absolute bottom-8 sm:block hidden right-8 w-48 h-48 rounded-full object-cover shadow-lg z-0"
        style={{ border: "4px solid #D1D5DB" }}
      />
     
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8 relative z-10">
        <div className="space-y-5">
      
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">My Profile</h1>
            <p className="text-sm text-gray-500">Manage your account information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded border border-gray-200 p-6">
            <div className="flex items-start gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src={user.imageUrl || "/default-avatar.png"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border border-gray-200"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{name}</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Member since {joinDate}</span>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="flex items-center gap-3">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-xs text-gray-500">Manage account settings</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Statistics */}
          <div className="bg-white rounded border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Ticket Activity</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <FileText className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded">
                <AlertCircle className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p className="text-2xl font-semibold text-amber-600">{stats.open}</p>
                <p className="text-xs text-gray-500">Open</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded">
                <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-2xl font-semibold text-blue-600">{stats.inProgress}</p>
                <p className="text-xs text-gray-500">In Progress</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-2xl font-semibold text-green-600">{stats.resolved}</p>
                <p className="text-xs text-gray-500">Resolved</p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Full Name</span>
                <span className="text-sm font-medium text-gray-900">{name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Email Address</span>
                <span className="text-sm font-medium text-gray-900">{email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Phone Number</span>
                <span className="text-sm font-medium text-gray-900">{phone}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Account Status</span>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-green-50 text-green-700">Active</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyProfile;