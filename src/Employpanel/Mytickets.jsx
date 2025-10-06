import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery ,useMutation } from "convex/react";
import { Clock, CheckCircle2, AlertCircle, XCircle, FileText, Trash, Tag, Filter, TrendingUp, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

function MyTickets() {
     const deleteTicketMutation = useMutation("deleteTicket:deleteTicket"); 

  const handleDelete = async (ticketId) => {
    toast(
      (t) => (
        <span>
          Are you sure you want to delete this ticket?
          <div className="mt-2 flex gap-2 justify-center">
            <button
              className="px-3 cursor-pointer py-1 bg-red-500 text-white rounded"
              onClick={async () => {
                await deleteTicketMutation({ ticketId });
                toast.dismiss(t.id);
                toast.success("Ticket deleted!");
                // Optionally refetch tickets here
              }}
            >
              Yes, Delete
            </button>
            <button
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </span>
      ),
      { duration: 6000 }
    );
  };
    

  const { user } = useUser();
  const [filterStatus, setFilterStatus] = useState("all");
  
  const tickets = useQuery(
    "getMyTickets:getMyTickets",
    user?.primaryEmailAddress?.emailAddress 
      ? { reporterEmail: user.primaryEmailAddress.emailAddress }
      : "skip"
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "open":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      resolved: "bg-green-100 text-green-700 border-green-200",
      "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
      open: "bg-amber-100 text-amber-700 border-amber-200",
      rejected: "bg-red-100 text-red-700 border-red-200"
    };
    return styles[status] || styles.open;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to view your tickets.</p>
        </div>
      </div>
    );
  }

  if (tickets === undefined) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gray-800 text-white px-6 py-4 shadow-lg border-b-2 border-yellow-400">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-gray-900 font-black text-lg">AS</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg text-yellow-400">Ayushmaan</span>
              <span className="font-bold text-lg text-white">Solutions</span>
            </div>
          </div>
        </header>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">Loading your tickets...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredTickets = filterStatus === "all" 
    ? tickets 
    : tickets.filter(t => t.status === filterStatus);

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in-progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
          <nav className="hidden md:flex space-x-8 font-medium">
            <button className="text-yellow-400 border-b-2 border-yellow-400 pb-1">My Tickets</button>
            <button className="hover:text-yellow-400 transition">Raise Ticket</button>
            <button className="hover:text-yellow-400 transition">Profile</button>
          </nav>
        </div>
      </header>

      {/* Main Content with Split Layout */}
      <main className="max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Side - Illustration (20%) */}
          <div className="lg:col-span-1">
            {/* Illustration Card - Full Height */}
            <div className="rounded-2xl p-6 border-2 border-yellow-200 h-full flex flex-col items-center justify-center sticky top-0 mb-0">
              <div className="h-full w-full flex items-center justify-center mb-0">
                <img 
                  src="/xyz.jpeg" 
                  alt="Support illustration" 
                  className="w-full h-full object-cover rounded-lg"
                 
                />
              </div>
             
            </div>
          </div>

          {/* Right Side - Tickets Table (80%) */}
          <div className="lg:col-span-4 space-y-6 align-middle justify-center relative sm:left-25 pt-1.5">
            {/* Welcome & Stats */}
          <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">My Tickets</h1>
              <p className="text-sm text-gray-500">Track and manage your support requests</p>
            </div>

            {/* Stats Cards */}
           <div className="grid grid-cols-4 gap-3">
              <div className="bg-white rounded border border-gray-200 p-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-xl font-semibold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded border border-gray-200 p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <div>
                    <p className="text-xs text-gray-500">Open</p>
                    <p className="text-xl font-semibold text-gray-900">{stats.open}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded border border-gray-200 p-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500">Progress</p>
                    <p className="text-xl font-semibold text-gray-900">{stats.inProgress}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded border border-gray-200 p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500">Resolved</p>
                    <p className="text-xl font-semibold text-gray-900">{stats.resolved}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-xl border border-gray-300 p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700 mr-2">Filter:</span>
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    filterStatus === "all"
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus("open")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    filterStatus === "open"
                      ? "bg-amber-400 text-gray-900"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => setFilterStatus("in-progress")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    filterStatus === "in-progress"
                      ? "bg-blue-400 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setFilterStatus("resolved")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    filterStatus === "resolved"
                      ? "bg-green-400 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>

            {/* Tickets List */}
   {filteredTickets.length === 0 ? (
              <div className="bg-white rounded border border-gray-200 p-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-900 mb-1">No tickets found</h3>
                <p className="text-sm text-gray-500">
                  {filterStatus === "all" 
                    ? "You haven't created any tickets yet." 
                    : `No ${filterStatus} tickets found.`}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">{getStatusIcon(ticket.status)}</div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{ticket.title}</p>
                              <p className="text-xs text-gray-500 truncate">{ticket.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">{ticket.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getStatusBadge(ticket.status)}`}>
                            {ticket.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-500">
                            {new Date(ticket.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })}
                          </span>
                        </td>
                         <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(ticket._id)}
                      className="text-red-600 cursor-pointer hover:text-red-800 text-sm font-medium"
                    >
                    <span className="flex gap-2 justify-center items-center">Delete <Trash2 className="w-4 h-4" /></span> 
                    </button>
                  </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyTickets;