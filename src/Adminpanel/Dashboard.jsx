import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  BarChart3,
  X
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data with dates
const mockTickets = [
  {
    id: "TKT-001",
    title: "Login Issue - Cannot access dashboard",
    category: "Technical Support",

    status: "pending",
    employee: "John Doe",
    createdAt: "2025-01-15",
    description: "Unable to login to the system",
    images: []
  },
  {
    id: "TKT-002",
    title: "Laptop keyboard not working",
    category: "IT Equipment",
  
    status: "in-progress",
    employee: "Sarah Smith",
    createdAt: "2025-01-14",
    description: "Keyboard keys are not responding",
    images: []
  },
  {
    id: "TKT-003",
    title: "Leave approval pending",
    category: "HR Related",

    status: "resolved",
    employee: "Mike Johnson",
    createdAt: "2025-01-13",
    description: "Waiting for leave approval",
    images: []
  },
  {
    id: "TKT-004",
    title: "Internet connectivity issues",
    category: "Technical Support",
   
    status: "pending",
    employee: "Emma Wilson",
    createdAt: "2025-01-15",
    description: "Wifi keeps disconnecting",
    images: []
  },
  {
    id: "TKT-005",
    title: "AC not working in meeting room",
    category: "Facilities",
   
    status: "in-progress",
    employee: "David Lee",
    createdAt: "2025-01-12",
    description: "Temperature control not functioning",
    images: []
  },
  {
    id: "TKT-006",
    title: "Printer not responding",
    category: "IT Equipment",
  
    status: "resolved",
    employee: "Lisa Chen",
    createdAt: "2025-01-11",
    description: "Cannot print documents",
    images: []
  },
  {
    id: "TKT-007",
    title: "Email server down",
    category: "Technical Support",
   
    status: "resolved",
    employee: "Tom Brown",
    createdAt: "2025-01-10",
    description: "Unable to send/receive emails",
    images: []
  }
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("tickets");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [tickets, setTickets] = useState(mockTickets);

  // Handle status change
  const handleStatusChange = (ticketId, newStatus) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.employee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate statistics
  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === "pending").length,
    inProgress: tickets.filter(t => t.status === "in-progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length
  };

  // Prepare data for date-wise chart
  const dateWiseData = tickets.reduce((acc, ticket) => {
    const existing = acc.find(item => item.date === ticket.createdAt);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date: ticket.createdAt, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Prepare data for status pie chart
  const statusData = [
    { name: "Pending", value: stats.pending, color: "#FBBF24" },
    { name: "In Progress", value: stats.inProgress, color: "#3B82F6" },
    { name: "Resolved", value: stats.resolved, color: "#10B981" }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "in-progress": return "bg-blue-100 text-blue-700 border-blue-300";
      case "resolved": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-4 shadow-lg border-b-2 border-yellow-400">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-lg text-yellow-400">Ayushman</span>
            <span className="font-black text-lg text-gray-300">Solutions</span>
            <span className="ml-3 text-sm text-gray-400">Admin Dashboard</span>
          </div>
          <button className="px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("tickets")}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === "tickets"
                ? "text-yellow-600 border-b-2 border-yellow-400"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Tickets
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === "analytics"
                ? "text-yellow-600 border-b-2 border-yellow-400"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Analytics
          </button>
        </div>

        {activeTab === "tickets" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Tickets</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">In Progress</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Resolved</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{stats.resolved}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tickets by ID, title, or employee..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
                <button className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export
                </button>
              </div>

              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none"
                    >
                      <option value="all">All Categories</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="HR Related">HR Related</option>
                      <option value="IT Equipment">IT Equipment</option>
                      <option value="Facilities">Facilities</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Ticket ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Category
                      </th>
                    
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">{ticket.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-900 font-medium">{ticket.title}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-700">{ticket.employee}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{ticket.category}</span>
                        </td>
                       
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 ${getStatusColor(ticket.status)}`}
                          >
                            <option value="pending">PENDING</option>
                            <option value="in-progress">IN PROGRESS</option>
                            <option value="resolved">RESOLVED</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {ticket.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="text-yellow-600 hover:text-yellow-700 font-semibold flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTickets.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 font-medium">No tickets found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Date-wise Ticket Trend */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
                Tickets Created Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dateWiseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '2px solid #FBBF24',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#FBBF24" 
                    strokeWidth={3}
                    dot={{ fill: '#FBBF24', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Tickets Created"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution Pie Chart */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Ticket Status Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-center gap-4">
                  {statusData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        {item.name}: {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Bar Chart */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Status Comparison
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        border: '2px solid #FBBF24',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar dataKey="value" fill="#FBBF24" radius={[8, 8, 0, 0]}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {tickets.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{ticket.title}</p>
                      <p className="text-sm text-gray-600">by {ticket.employee} • {ticket.createdAt}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedTicket.title}</h2>
                  <p className="text-sm text-gray-600">Ticket ID: {selectedTicket.id}</p>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Employee</label>
                    <p className="text-gray-900 font-medium">{selectedTicket.employee}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Date Created</label>
                    <p className="text-gray-900 font-medium">{selectedTicket.createdAt}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Category</label>
                    <p className="text-gray-900 font-medium">{selectedTicket.category}</p>
                  </div>
                 
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">Description</label>
                  <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">{selectedTicket.description}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">Current Status</label>
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold border-2 ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-200 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}