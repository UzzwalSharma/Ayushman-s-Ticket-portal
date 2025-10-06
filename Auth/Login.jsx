import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { LogIn, ArrowRight, Ticket, Clock, CheckCircle2 } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
function Login() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
 const { user } = useUser();

  return (
    <div className="min-h-screen h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-gray-800 text-white px-4 sm:px-6 py-4 shadow-lg border-b-2 border-yellow-400 relative z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-gray-900 font-black text-base sm:text-lg">AS</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="font-bold text-base sm:text-lg text-yellow-400 leading-tight">Ayushman</span>
              <span className="font-bold text-base sm:text-lg text-white sm:ml-1 leading-tight">Solutions</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <SignedOut>
              <SignInButton mode="modal" redirectUrl="/Mainscreen">
                <button 
                  className="flex cursor-pointer items-center space-x-2 bg-yellow-400 text-gray-900 font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-yellow-500 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  aria-label="Sign in to employee portal"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                afterSignInUrl="/Mainscreen"
                afterSignUpUrl="/Mainscreen"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 sm:w-10 sm:h-10 border-2 border-yellow-400 ring-2 ring-yellow-400/20",
                    userButtonPopoverCard: "shadow-2xl border border-gray-200",
                    userButtonPopoverActionButton: "hover:bg-yellow-50 transition",
                    userButtonPopoverActionButtonText: "text-gray-700 font-medium",
                    userButtonPopoverFooter: "hidden"
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Split Screen Layout */}
      <main className="flex flex-1 h-full overflow-hidden">
        {/* Left Image Section - Desktop Only */}
        <div className="hidden lg:flex w-1/2 relative bg-white p-8 overflow-hidden">
          <div className="w-full h-full border-4 border-yellow-400 rounded-3xl overflow-hidden relative">
            <img 
              src="/login.jpeg" 
              alt="Ayushmaan Solutions team collaboration" 
              className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
              onError={(e) => {
                e.target.style.display = 'none';
                setIsImageLoaded(true);
              }}
              style={{ objectFit: 'cover', height: '100%', width: '100%' }}
            />
          </div>
        </div>

        {/* Right Auth Section */}
        <div className="flex flex-col w-full lg:w-1/2 items-center justify-center p-6 sm:p-8 bg-gray-50 h-full overflow-hidden">
          <SignedOut>
            <div className="w-full max-w-md space-y-8">
              {/* Welcome Message */}
              <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                Welcome to{" "}
                <span className="text-yellow-500 block">
                  Ayushman Solutions
                </span>
              </h1>
              <p className="text-gray-600 text-lg">
                Employee Ticket Portal
              </p>
            </div>

              {/* Login Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-200">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg overflow-hidden">
                    <img 
                      src="/logoart.png" 
                      alt="Ayushmaan Solutions Logo" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<span class="text-gray-900 font-black text-3xl">AS</span>';
                      }}
                    />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Employee Sign In</h2>
                  <p className="text-gray-600 text-sm sm:text-base">Access your support ticket dashboard</p>
                </div>

                 <SignInButton mode="modal">
                  <button className="w-full cursor-pointer flex items-center justify-center space-x-3 bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl group">
                    <LogIn className="w-5 h-5" />
                    <span>Sign In to Continue</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </SignInButton>

              
               
              </div>


            </div>
          </SignedOut>

          <SignedIn>
            <div className="w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-2xl p-10 sm:p-12 text-center border border-gray-200">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle2 className="w-14 h-14 text-green-600" />
              
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Welcome Back {user?.firstName || "Employee"}!  </h2>
                <p className="text-base sm:text-lg text-gray-600 mb-8">
                Feel free to report your issues{' '}
                  <span className="font-semibold text-yellow-600">We are here to help!</span>
                </p>
                
                <div className="space-y-3">
                  <a 
                    href="/Mainscreen"
                    className="w-full flex items-center justify-center space-x-2 bg-yellow-400 text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  
             
                </div>
              </div>
            </div>
          </SignedIn>
        </div>
      </main>
    </div>
  );
}

export default Login;