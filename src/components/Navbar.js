import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Building2, 
  Users, 
  Calendar, 
  LogOut, 
  Menu, 
  X,
  User,
  Stethoscope
} from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <div className="logo-icon">
            <Stethoscope size={24} />
          </div>
          <span>HealthCarePro</span>
        </Link>

        {/* Desktop Menu */}
        <div className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="navbar-links">
            <li>
              <Link 
                to="/" 
                className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/hospitals" 
                className={`navbar-link ${isActive('/hospitals') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Building2 size={18} />
                <span>Hospitals</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/doctors" 
                className={`navbar-link ${isActive('/doctors') ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Users size={18} />
                <span>Doctors</span>
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li>
                  <Link 
                    to="/book-appointment" 
                    className={`navbar-link ${isActive('/book-appointment') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <Calendar size={18} />
                    <span>Book Appointment</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin" 
                    className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <User size={18} />
                    <span>My Appointments</span>
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Auth Buttons */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <div className="navbar-user">
                  <User size={18} />
                  <span>{user?.firstName}</span>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary navbar-btn">
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMobileMenu}>
                  <button className="btn btn-secondary navbar-btn">Login</button>
                </Link>
                <Link to="/register" onClick={closeMobileMenu}>
                  <button className="btn btn-primary navbar-btn">Sign Up</button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
