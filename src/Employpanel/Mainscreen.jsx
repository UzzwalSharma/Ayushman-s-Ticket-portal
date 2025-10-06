import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Upload, X, NotebookPenIcon } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "convex/react";
import toast from "react-hot-toast";


export default function EmployeePanel() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
    reporterName: "",
    reporterEmail: "",
    reporterContact: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const { user } = useUser();

  const MAX_FILES = 5;
  const MAX_FILE_SIZE_MB = 5;

  const uploadFileToCloudinary = async (file) => {
    if (!file) return;
    if (uploadedImages.length >= MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} images allowed.`);
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`Maximum file size: ${MAX_FILE_SIZE_MB}MB`);
      return;
    }

    setLoading(true);
    setLoadingMessage("Uploading image...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Ayushman_uploads");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dhkknzgbh/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      const url = data.secure_url;
      console.log("Uploaded image URL:", url); 
      setUploadedImages((prev) => [...prev, url]);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed! Please try again.");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      files.forEach(file => {
        if (file.type.startsWith("image/")) {
          uploadFileToCloudinary(file);
        }
      });
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith("image/")) {
        uploadFileToCloudinary(file);
      }
    });
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };
//convex logic
  const createTicket = useMutation("ticket:createTicket");

   const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.reporterName.trim() ||
      !formData.reporterEmail.trim() ||
      !formData.reporterContact.trim() ||
      !formData.title.trim() ||
      !formData.category.trim() ||
      !formData.description.trim()
    ) {
      toast.error("Please fill all fields before submitting.");
      return;
    }

    setLoading(true);
    setLoadingMessage("Submitting ticket...");

    try {
      await createTicket({
        reporterName: formData.reporterName,
        reporterEmail: formData.reporterEmail,
        reporterContact: formData.reporterContact,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        images: uploadedImages,
      });

      toast.success("Ticket submitted successfully");
      setFormData({
        title: "",
        category: "",
        priority: "",
        description: "",
        reporterName: "",
        reporterEmail: "",
        reporterContact: "",
      });
      setUploadedImages([]);
    } catch (err) {
      console.error("Error submitting ticket:", err);
      toast.error("Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  useEffect(() => {
    // Autofill reporter info from Clerk user if available
    if (user) {
      setFormData((prev) => ({
        ...prev,
        reporterName: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "",
        reporterEmail: user.emailAddresses?.[0]?.emailAddress || "",
      }));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative">
      {/* Navbar */}
      <header className="bg-gray-900 text-white flex justify-between items-center px-6 py-4 shadow-lg relative z-10 border-b-2 border-yellow-400">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-lg text-yellow-400">Ayushman</span>
          <span className="font-black text-lg text-gray-300">Solutions</span>
        </div>

        <nav className="hidden md:flex space-x-8 font-medium">
          <button className="hover:text-yellow-400 transition">
            My Tickets
          </button>
          <button className="text-yellow-400 border-b-2 border-yellow-400 pb-1 transition">
            Raise Ticket
          </button>
          <button className="hover:text-yellow-400 transition">Profile</button>
        </nav>

        <div className="md:hidden">
          <button className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.firstName || "Employee"}! 👋
              </h1>
              <p className="text-gray-600">
                Let's get your issue resolved quickly
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Left Side */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <NotebookPenIcon className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Create New Ticket
                  </h2>
                  <p className="text-sm text-gray-600">
                    Fill in the details below
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Reporter Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reporter Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.reporterName}
                      onChange={(e) =>
                        setFormData({ ...formData, reporterName: e.target.value })
                      }
                      placeholder="Your full name"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Reporter Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.reporterEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, reporterEmail: e.target.value })
                      }
                      placeholder="your@email.com"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                     type="tel"
                      required
                      pattern="[0-9]{10,15}"
                      value={formData.reporterContact}
                      onChange={(e) =>
                        setFormData({ ...formData, reporterContact: e.target.value })
                      }
                      placeholder="Mobile number"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ticket Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Brief description of your issue"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition"
                    >
                      <option value="">Select category</option>
                      <option value="technical">Technical Support</option>
                      <option value="hr">HR Related</option>
                      <option value="it">IT Equipment</option>
                      <option value="facilities">Facilities</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={5}
                    placeholder="Please provide detailed information about your issue..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Attach Images (Optional)
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                      isDragOver 
                        ? "border-yellow-500 bg-yellow-50" 
                        : "border-gray-300 hover:border-yellow-400 hover:bg-yellow-50/50"
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-semibold">
                      {isDragOver ? "Drop your images here" : "Click to upload or drag & drop images"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, GIF up to {MAX_FILE_SIZE_MB}MB
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {uploadedImages.length}/{MAX_FILES} images uploaded
                    </p>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {uploadedImages.map((url, index) => (
                        <motion.div 
                          key={index} 
                          className="relative group"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <img
                            src={url}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-34 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white cursor-pointer rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-yellow-400 text-gray-900 font-bold py-4 rounded-xl hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    Submit Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        title: "",
                        category: "",
                        priority: "",
                        description: "",
                        reporterName: "",
                        reporterEmail: "",
                        reporterContact: "",
                      });
                      setUploadedImages([]);
                    }}
                    className="px-8 bg-gray-100 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-200 transition cursor-pointer"
                  >
                    Clear Form 
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Sidebar - Right Side */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Illustration */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-md p-6 border-2 border-yellow-200 overflow-hidden relative">
              <div className="relative z-10">
                <img
                  src="/illustration2.jpeg"
                  alt="Support illustration"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
                <p className="text-center text-sm text-gray-700 mt-4 font-semibold">
                  We're here to help you resolve issues quickly
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 text-center max-w-xs w-full shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="w-12 h-12 border-4 border-t-yellow-400 border-gray-200 rounded-full"
              />
              <p className="text-lg font-semibold text-gray-900">{loadingMessage}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}