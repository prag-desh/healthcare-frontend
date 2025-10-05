import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, Home, Stethoscope } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <Stethoscope className="brand-icon" />
          <span>Healthcare Appointment</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            <Home size={18} />
            <span>Home</span>
          </Link>
          
          <Link to="/doctors" className="nav-link">
            <Stethoscope size={18} />
            <span>Doctors</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/book-appointment" className="nav-link">
                <Calendar size={18} />
                <span>Book Appointment</span>
              </Link>

              <Link to="/admin" className="nav-link">
                <User size={18} />
                <span>My Appointments</span>
              </Link>

              <div className="nav-user">
                <span className="user-name">
                  {user?.firstName} {user?.lastName}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
