import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorsPage from './pages/DoctorsPage';
import HospitalsPage from './pages/HospitalsPage'; // NEW
import AppointmentBookingPage from './pages/AppointmentBookingPage';
import AdminPage from './pages/AdminPage';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Hospital Routes - NEW (Details page disabled for now) */}
            <Route path="/hospitals" element={<HospitalsPage />} />
            
            {/* Doctor Routes */}
            <Route path="/doctors" element={<DoctorsPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/book-appointment" 
              element={
                <PrivateRoute>
                  <AppointmentBookingPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <PrivateRoute>
                  <AdminPage />
                </PrivateRoute>
              } 
            />
            
            {/* Catch all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
