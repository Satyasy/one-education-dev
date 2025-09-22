import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 z-1 sm:p-0 min-h-screen">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 lg:grid relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-10 left-10 w-32 h-32 bg-red-200 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-gray-300 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-red-100 rounded-full blur-lg animate-bounce delay-500"></div>
          </div>
          
          <div className="relative flex items-center justify-center z-10 p-8">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            
            <div className="flex flex-col items-center max-w-md text-center space-y-8">
              {/* Logo section with enhanced styling */}
              <div className="transform hover:scale-105 transition-transform duration-300">
                <Link to="/" className="block mb-4 group">
                  <div className="relative">
                    <div className="absolute -inset-3 bg-white/80 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300 shadow-lg"></div>
                    <img
                      width={280}
                      height={58}
                      src="/images/logo/one-logo.png"
                      alt="Logo"
                      className="relative z-10 drop-shadow-lg"
                    />
                  </div>
                </Link>
                
                {/* Logo acronym explanation */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-500 tracking-wider uppercase">
                    Organized Network for Education
                  </p>
                </div>
              </div>
              
              {/* Enhanced description */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-700 leading-tight">
                  Welcome to One Admin
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-600 leading-relaxed font-medium">
                  Modern & Powerful Admin Dashboard
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-500 max-w-sm mx-auto leading-relaxed">
                  Built with React, TypeScript, and Tailwind CSS for the best developer experience
                </p>
              </div>
              
              {/* Feature highlights */}
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-100 text-red-800 backdrop-blur-sm border border-red-200 shadow-sm">
                  🚀 Fast & Modern
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 backdrop-blur-sm border border-gray-300 shadow-sm">
                  🔒 Secure
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-700 backdrop-blur-sm border border-red-200 shadow-sm">
                  📱 Responsive
                </span>
              </div>
              
              {/* Subtle animation indicator */}
              <div className="flex justify-center pt-6">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                  <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse delay-700"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Subtle bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-200/30 to-transparent"></div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <div className="backdrop-blur-sm bg-white/20 dark:bg-gray-800/20 rounded-full p-1 border border-white/30 dark:border-gray-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <ThemeTogglerTwo />
          </div>
        </div>
      </div>
    </div>
  );
}
