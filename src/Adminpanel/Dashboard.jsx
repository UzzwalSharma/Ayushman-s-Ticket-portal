import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
  LogOut,
  User,
  Download,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const ticketsQuery = useQuery("Fetchall:all");
  const tickets = ticketsQuery || [];
  const isLoading = ticketsQuery === undefined;
  
  // Convex mutation
  const updateTicketStatus = useMutation("updateStatus:updateStatus");

  const handleStatusChange = async (ticket_id, newStatus) => {
    try {
      await updateTicketStatus({ id: ticket_id, status: newStatus });
      toast.success("Ticket status updated!");
    } catch (error) {
      toast.error("Failed to update ticket status");
      console.error("Failed to update ticket status:", error);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      (ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       ticket._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       ticket.reporterName?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || ticket.category?.trim() === categoryFilter.trim();
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === "pending").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  const dateWiseData = tickets
    .reduce((acc, ticket) => {
      const existing = acc.find((item) => item.date === ticket.createdAt);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ date: ticket.createdAt, count: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const statusData = [
    { name: "Pending", value: stats.pending, color: "#F59E0B" },
    { name: "In Progress", value: stats.inProgress, color: "#3B82F6" },
    { name: "Resolved", value: stats.resolved, color: "#10B981" },
  ];

  // Category breakdown
  const categoryData = tickets.reduce((acc, ticket) => {
    const cat = ticket.category || "Uncategorized";
    const existing = acc.find(item => item.name === cat);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ 
        name: cat, 
        value: 1,
        color: cat === "Technical Support" ? "#3B82F6" : 
               cat === "HR Related" ? "#8B5CF6" :
               cat === "IT Equipment" ? "#10B981" :
               cat === "Facilities" ? "#F59E0B" : "#6B7280"
      });
    }
    return acc;
  }, []);

  // Daily ticket volume (last 7 entries)
  const dailyVolumeData = dateWiseData.slice(-7);

  // Average resolution time calculation (mock data for demo)
  const avgResolutionDays = 2.4;
  const responseRate = ((stats.resolved / stats.total) * 100).toFixed(1);

  // Export function
  const exportToCSV = () => {
    const headers = ["ID", "Title", "Employee", "Contact", "Category", "Status", "Date", "Description"];
    const rows = filteredTickets.map(ticket => [
      ticket._id,
      ticket.title,
      ticket.reporterName,
      ticket.reporterContact,
      ticket.category,
      ticket.status,
      new Date(ticket.createdAt).toLocaleDateString(),
      ticket.description?.replace(/,/g, ';') || ""
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tickets_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Tickets exported successfully!");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700";
      case "in-progress":
        return "bg-blue-50 text-blue-700";
      case "resolved":
        return "bg-green-50 text-green-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  //logout
  const logoutMutation = useMutation("logout:logout");
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("sessionToken");

    if (token) {
      try {
        await logoutMutation({ token });
        toast.success("Logged out successfully");
      } catch (err) {
        toast.error("Logout failed");
        console.error(err);
      }
    }

    // Clear localStorage
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("sessionToken");

    // Redirect
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <header className="bg-gray-800 text-white px-6 py-4 shadow-lg border-b-2 border-yellow-400">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
              <img src="/logoart.png" alt="" className="w-8 h-8 rounded" />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-lg text-yellow-400">
                Ayushmaan
              </span>
              <span className="font-bold text-lg text-white">Solutions</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-yellow-300 font-semibold text-base">
              <User className="w-5 h-5" />
              Welcome, Admin!
            </span>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold cursor-pointer rounded transition shadow"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm font-medium">Loading tickets...</p>
          </div>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("tickets")}
              className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === "tickets"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer "
              }`}
            >
              All Tickets
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`pb-3 px-4 text-sm cursor-pointer font-medium transition-colors border-b-2 -mb-px ${
                activeTab === "analytics"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Analytics
            </button>
          </div>

          {activeTab === "tickets" && (
            <div className="space-y-5">
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded border border-gray-200 p-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Total</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {stats.total}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded border border-gray-200 p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <div>
                      <p className="text-xs text-gray-500">Pending</p>
                      <p className="text-xl font-semibold text-amber-600">
                        {stats.pending}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded border border-gray-200 p-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500">In Progress</p>
                      <p className="text-xl font-semibold text-blue-600">
                        {stats.inProgress}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded border border-gray-200 p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500">Resolved</p>
                      <p className="text-xl font-semibold text-green-600">
                        {stats.resolved}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white rounded border border-gray-200 p-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by ID, title, or employee..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 border border-gray-200 flex items-center gap-2 cursor-pointer"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-900 border border-gray-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>

                {showFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Status
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Category
                      </label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none"
                      >
                        <option value="all">All Categories</option>
                        <option value="technical">
                          Technical Support
                        </option>
                        <option value="hr">HR Related</option>
                        <option value="it">IT Equipment</option>
                        <option value="facilities">Facilities</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Tickets Table */}
              <div className="bg-white rounded border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact No.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTickets.map((ticket) => (
                      <tr
                        key={ticket._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-900">
                            {ticket.title}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">
                            {ticket.reporterName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-700">
                            {ticket.reporterContact}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-gray-600">
                            {ticket.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={ticket.status}
                            onChange={(e) =>
                              handleStatusChange(ticket._id, e.target.value)
                            }
                            className={`px-2 py-1 rounded text-xs font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900 ${getStatusColor(ticket.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-500">
                            {new Date(ticket.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="text-gray-700 hover:text-gray-900 text-sm font-medium cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredTickets.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No tickets found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-5">
              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <span className="text-xs font-medium text-green-600">+12%</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500 mt-1">Total Tickets</p>
                </div>

                <div className="bg-white rounded border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-xs font-medium text-green-600">{responseRate}%</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                  <p className="text-xs text-gray-500 mt-1">Resolution Rate</p>
                </div>

                <div className="bg-white rounded border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-medium text-gray-600">Avg</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{avgResolutionDays}d</p>
                  <p className="text-xs text-gray-500 mt-1">Resolution Time</p>
                </div>

                <div className="bg-white rounded border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-xs font-medium text-blue-600">Active</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                  <p className="text-xs text-gray-500 mt-1">In Progress</p>
                </div>
              </div>

              {/* Main Charts Row */}
              <div className="grid grid-cols-3 gap-5">
                {/* Trend Chart - Takes 2 columns */}
                <div className="col-span-2 bg-white rounded border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Ticket Volume Trend
                    </h3>
                    <span className="text-xs text-gray-500">Last 7 Days</span>
                  </div>
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={dailyVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#9CA3AF"
                        style={{ fontSize: "11px" }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="#9CA3AF" style={{ fontSize: "11px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "12px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#3B82F6"
                        strokeWidth={2.5}
                        dot={{ fill: "#3B82F6", r: 5, strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 7 }}
                        name="Tickets"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Status Pie Chart - Takes 1 column */}
                <div className="bg-white rounded border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Status Overview
                  </h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          fontSize: "12px",
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB"
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-3 space-y-2">
                    {statusData.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Secondary Charts Row */}
              <div className="grid grid-cols-2 gap-5">
                {/* Category Distribution */}
                <div className="bg-white rounded border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Category Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={categoryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                      <XAxis type="number" stroke="#9CA3AF" style={{ fontSize: "11px" }} />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        stroke="#9CA3AF" 
                        style={{ fontSize: "11px" }}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Status Comparison Bar */}
                <div className="bg-white rounded border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Status Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis
                        dataKey="name"
                        stroke="#9CA3AF"
                        style={{ fontSize: "11px" }}
                      />
                      <YAxis stroke="#9CA3AF" style={{ fontSize: "11px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Export Button for Analytics */}
              <div className="flex justify-end">
                <button
                  onClick={exportToCSV}
                  className="px-6 py-2.5 bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-900 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Export All Data
                </button>
              </div>
            </div>
          )}
        </main>
      )}
      
      {/* Modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedTicket.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1 hover:bg-red-400 cursor-pointer rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Employee
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedTicket.reporterName}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Date
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(selectedTicket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Category
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedTicket.category}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">
                    Status
                  </label>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getStatusColor(selectedTicket.status)}`}
                  >
                    {selectedTicket.status.replace("-", " ")}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-2">
                  Description
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Show images if available */}
              {selectedTicket.images && selectedTicket.images.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-2">
                    Attached Images
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {selectedTicket.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Ticket Attachment ${idx + 1}`}
                        className="w-32 h-32 object-cover rounded border border-gray-200 shadow"
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedTicket(null)}
                className="w-full bg-gray-200 text-gray-700 cursor-pointer text-sm font-medium py-2 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}