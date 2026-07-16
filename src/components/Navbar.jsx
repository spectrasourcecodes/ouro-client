// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Home, TrendingUp, Wallet, User, LogOut, 
  CreditCard, LayoutDashboard, MessageCircle 
} from 'lucide-react';
import { toast } from 'react-toastify';

const Navbar = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = isAuthenticated ? [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/market', label: 'Market', icon: TrendingUp },
    { path: '/invest', label: 'Invest', icon: TrendingUp },
    { path: '/withdraw', label: 'Withdraw', icon: Wallet },
    { path: '/profile', label: 'Profile', icon: User },

    // ✅ Support (Telegram)
    { 
      path: 'https://t.me/+EUOCexi1um8yY2U8', 
      label: 'Support', 
      icon: MessageCircle, 
      external: true 
    },

  ] : [
    { path: '/', label: 'Home', icon: Home },
    { path: '/market', label: 'Market', icon: TrendingUp },
    { path: '/login', label: 'Login', icon: User },
    { path: '/register', label: 'Register', icon: CreditCard },

    // ✅ Support (Telegram)
    { 
      path: 'https://t.me/+EUOCexi1um8yY2U8', 
      label: 'Support', 
      icon: MessageCircle, 
      external: true 
    },
  ];

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      toast.success("Logout successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">ARK</span>
              <span className="text-sm text-gray-500">invest</span>
            </Link>
            
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => {
                const Icon = link.icon;

                if (link.external) {
                  return (
                    <a
                      key={link.path}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-blue-600"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors
                      ${location.pathname === link.path 
                        ? 'text-blue-600' 
                        : 'text-gray-600 hover:text-blue-600'}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <div className="px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-1">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">ARK</span>
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;

                if (link.external) {
                  return (
                    <a
                      key={link.path}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </a>
                  );
                }

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors
                      ${location.pathname === link.path 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'hover:bg-gray-50'}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}

              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      {isAuthenticated && (
        <div className="md:hidden fixed bottom-0 w-full bg-white border-t z-40">
          <div className="flex justify-around items-center py-2">
            {navLinks.map((link) => {
              const Icon = link.icon;

              if (link.external) {
                return (
                  <a
                    key={link.path}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-2 text-gray-600"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs mt-1">{link.label}</span>
                  </a>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex flex-col items-center p-2 transition-colors
                    ${location.pathname === link.path 
                      ? 'text-blue-600' 
                      : 'text-gray-600'}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;