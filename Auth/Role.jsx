import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { Users, Shield, ArrowRight } from 'lucide-react';

function ChooseRole() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate(); // Add this hook

  const handleNavigation = (role) => {
    // Navigate to the correct login route
    navigate(`/${role}-login`);
  };

  const roles = [
    {
      id: 'employee',
      title: 'Employee',
      description: 'Report & manage your tickets',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      hoverGradient: 'from-blue-600 to-cyan-600',
      image: '/user.png'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage employees & tickets',
      icon: Shield,
      gradient: 'from-amber-500 to-orange-500',
      hoverGradient: 'from-amber-600 to-orange-600',
      image: '/admin.png'
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Animated Background */}
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


  

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Title Section with Animation */}
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <div className="inline-block">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2 tracking-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent animate-gradient">
                Ayushman Solutions
              </span>
            </h1>
            <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            Support Portal
          </h2>
          
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-400" />
            <p className="text-gray-300 text-lg font-medium">Choose Your Identity</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-400" />
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const isHovered = hoveredCard === role.id;
            
            return (
              <div
                key={role.id}
                onClick={() => handleNavigation(role.id)}
                onMouseEnter={() => setHoveredCard(role.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="cursor-pointer group relative"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${isHovered ? role.hoverGradient : role.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-75 transition duration-500`} />
                
                {/* Card */}
                <div className="relative bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl border border-gray-200/50 transition-all duration-300 transform group-hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden">
                  {/* Top Accent Line */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${role.gradient} transform origin-left transition-transform duration-300 ${isHovered ? 'scale-x-100' : 'scale-x-0'}`} />
                  
                
                  {/* Avatar */}
                  <div className={`relative w-32 h-32 mb-6 transform transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} rounded-full blur-md opacity-50`} />
                    <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                      <img
                        src={role.image}
                        alt={role.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    {role.title}
                    <ArrowRight className={`w-5 h-5 transform transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                  </h2>
                  
                  <p className="text-gray-600 text-base font-medium mb-4">
                    {role.description}
                  </p>

                  {/* Action Button */}
                  <div className={`mt-2 px-6 py-2 rounded-full bg-gradient-to-r ${role.gradient} text-white font-semibold text-sm shadow-md transform transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    Continue
                  </div>

                  {/* Bottom Decoration */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50/50 to-transparent pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Text */}
        <p className="text-gray-300 text-sm mt-12 text-center max-w-md">
          Select your role to access the appropriate dashboard and features
        </p>
      </main>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ChooseRole;