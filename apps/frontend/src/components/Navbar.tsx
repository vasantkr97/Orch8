import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <nav className="absolute top-0 w-full z-50 border-b border-white/5 bg-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
             <div className="h-8 w-8 bg-black border border-lime-500/50 rounded-lg flex items-center justify-center group-hover:bg-lime-500/10 transition-colors">
                <span className="font-bold text-lime-500 font-logo text-sm">O8</span>
             </div>
             <span className="font-bold text-xl tracking-tight font-logo text-white hidden sm:block">Orch8</span>
          </Link>
          
          <div className="flex items-center gap-6">
            {!isAuthPage && (
                <>
                    <Link to="/signin" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Sign In
                    </Link>
                    <Link 
                    to="/signup" 
                    className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-colors"
                    >
                    Get Started
                    </Link>
                </>
            )}
             {isAuthPage && location.pathname === '/signup' && (
                <div className="text-sm text-gray-400">
                    Already have an account? <Link to="/signin" className="text-white hover:underline">Sign in</Link>
                </div>
            )}
             {isAuthPage && location.pathname === '/signin' && (
                <div className="text-sm text-gray-400">
                    New to Orch8? <Link to="/signup" className="text-white hover:underline">Sign up</Link>
                </div>
            )}
          </div>
        </div>
      </nav>
  );
}
