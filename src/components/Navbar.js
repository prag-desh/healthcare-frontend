import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { 
  LogOut, 
  User, 
  Calendar, 
  Home, 
  Stethoscope,
  Building2,
  Menu, 
  X,
  Bell,
  Settings,
  ChevronDown
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/hospitals', label: 'Hospitals', icon: Building2 },
    { path: '/doctors', label: 'Doctors', icon: Stethoscope },
    ...(isAuthenticated ? [
      { path: '/book-appointment', label: 'Book Appointment', icon: Calendar },
      { path: '/admin', label: 'My Appointments', icon: User }
    ] : [])
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowProfileDropdown(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate('/login');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <motion.div 
            className="brand-icon"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Stethoscope size={28} />
          </motion.div>
          <span className="brand-text">HealthCare<span className="brand-highlight">Pro</span></span>
        </Link>

        <div className="navbar-desktop">
          <div className="nav-links">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {isActivePath(item.path) && (
                  <motion.div
                    className="active-indicator"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <button className="notification-btn">
                  <Bell size={20} />
                  <span className="notification-badge">3</span>
                </button>

                <div className="profile-dropdown" ref={dropdownRef}>
                  <button 
                    className="profile-trigger"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    <div className="profile-avatar">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div className="profile-info">
                      <span className="profile-name">{user?.firstName} {user?.lastName}</span>
                      <span className="profile-role">Patient</span>
                    </div>
                    <ChevronDown size={16} className={showProfileDropdown ? 'rotate' : ''} />
                  </button>

                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div
                        className="dropdown-menu"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link to="/admin" className="dropdown-item">
                          <User size={16} />
                          <span>My Profile</span>
                        </Link>
                        <Link to="/admin" className="dropdown-item">
                          <Calendar size={16} />
                          <span>My Appointments</span>
                        </Link>
                        <Link to="/settings" className="dropdown-item">
                          <Settings size={16} />
                          <span>Settings</span>
                        </Link>
                        <div className="dropdown-divider"></div>
                        <button onClick={handleLogout} className="dropdown-item logout">
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-nav-links">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="mobile-nav-actions">
              {isAuthenticated ? (
                <>
                  <div className="mobile-profile">
                    <div className="profile-avatar">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div className="profile-info">
                      <span className="profile-name">{user?.firstName} {user?.lastName}</span>
                      <span className="profile-email">{user?.email}</span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-secondary btn-full">
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary btn-full">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-full">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
