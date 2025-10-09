import { 
  LogOut, 
  User, 
  Calendar, 
  Home, 
  Stethoscope,
  Building2, // ADD THIS
  Menu, 
  X,
  // ... rest of imports
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  User, 
  Calendar, 
  Home, 
  Stethoscope, 
  Menu, 
  X,
  ChevronDown,
  Bell,
  Settings,
  Activity
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActivePath = (path) => location.pathname === path;

  const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/hospitals', label: 'Hospitals', icon: Building2 }, // NEW
  { path: '/doctors', label: 'Doctors', icon: Stethoscope },
  ...(isAuthenticated ? [
    { path: '/book-appointment', label: 'Book Appointment', icon: Calendar },
    { path: '/admin', label: 'My Appointments', icon: User }
  ] : [])
];

  const menuVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    closed: {
      opacity: 0,
      x: "-100%",
      transition: {
        duration: 0.2
      }
    }
  };

  const profileVariants = {
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        duration: 0.2
      }
    },
    closed: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <motion.div 
            className="brand-icon-wrapper"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Activity className="brand-icon" />
          </motion.div>
          <div className="brand-text">
            <span className="brand-name">HealthCare</span>
            <span className="brand-subtitle">Pro</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu desktop-only">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`nav-link ${isActivePath(item.path) ? 'nav-link-active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {isActivePath(item.path) && (
                  <motion.div
                    className="nav-link-indicator"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Section */}
        <div className="navbar-actions desktop-only">
          {isAuthenticated ? (
            <div className="nav-user">
              <button className="notification-btn">
                <Bell size={20} />
                <span className="notification-badge">2</span>
              </button>
              
              <div className="profile-dropdown">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="profile-trigger"
                >
                  <div className="user-avatar">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div className="user-info">
                    <span className="user-name">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="user-email">{user?.email}</span>
                  </div>
                  <ChevronDown 
                    size={16} 
                    className={`chevron ${isProfileOpen ? 'chevron-open' : ''}`} 
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      className="profile-menu"
                      variants={profileVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                    >
                      <div className="profile-menu-header">
                        <div className="user-avatar large">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </div>
                        <div>
                          <div className="profile-name">
                            {user?.firstName} {user?.lastName}
                          </div>
                          <div className="profile-email">{user?.email}</div>
                        </div>
                      </div>
                      
                      <div className="profile-menu-divider" />
                      
                      <Link to="/profile" className="profile-menu-item">
                        <User size={16} />
                        <span>View Profile</span>
                      </Link>
                      
                      <Link to="/settings" className="profile-menu-item">
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>
                      
                      <div className="profile-menu-divider" />
                      
                      <button onClick={handleLogout} className="profile-menu-item logout-item">
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="mobile-menu-btn mobile-only"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="mobile-menu"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="mobile-menu-content">
                {/* Mobile Navigation Links */}
                <div className="mobile-nav-section">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link 
                        key={item.path}
                        to={item.path} 
                        className={`mobile-nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile User Section */}
                {isAuthenticated ? (
                  <div className="mobile-user-section">
                    <div className="mobile-user-info">
                      <div className="user-avatar">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </div>
                      <div>
                        <div className="user-name">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className="user-email">{user?.email}</div>
                      </div>
                    </div>
                    
                    <div className="mobile-user-actions">
                      <Link to="/profile" className="mobile-action-btn">
                        <User size={18} />
                        <span>Profile</span>
                      </Link>
                      <Link to="/settings" className="mobile-action-btn">
                        <Settings size={18} />
                        <span>Settings</span>
                      </Link>
                      <button onClick={handleLogout} className="mobile-action-btn logout">
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mobile-auth-section">
                    <Link 
                      to="/login" 
                      className="btn btn-secondary btn-full mb-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      className="btn btn-primary btn-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu-overlay mobile-only"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
