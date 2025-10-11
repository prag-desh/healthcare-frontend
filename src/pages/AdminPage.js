import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, Clock, FileText, User } from 'lucide-react';
import './AdminPage.css';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view appointments');
      navigate('/login');
      return;
    }

    fetchAppointments();
  }, [isAuthenticated, navigate, user]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      // Fetch all appointments
      const response = await fetch('https://healthcare-appointment-api.onrender.com/api/appointments/all');
      const data = await response.json();
      
      if (data.success) {
        // Filter appointments by logged-in user's email
        const userAppointments = data.appointments.filter(
          apt => apt.patientEmail?.toLowerCase() === user?.email?.toLowerCase()
        );
        setAppointments(userAppointments || []);
      } else {
        toast.error('Failed to load appointments');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading appointments..." />;
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>My Appointments</h1>
          <p>Manage your healthcare appointments</p>
        </div>

        <div className="filter-tabs">
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({appointments.length})
          </button>
          <button
            className={`tab ${filter === 'scheduled' ? 'active' : ''}`}
            onClick={() => setFilter('scheduled')}
          >
            Scheduled ({appointments.filter(a => a.status === 'scheduled').length})
          </button>
          <button
            className={`tab ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({appointments.filter(a => a.status === 'cancelled').length})
          </button>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            <Calendar size={64} />
            <h3>No appointments found</h3>
            <p>Book your first appointment to get started</p>
            <button onClick={() => navigate('/book-appointment')} className="btn btn-primary">
              Book Appointment
            </button>
          </div>
        ) : (
          <div className="appointments-list">
            {filteredAppointments.map((appointment) => (
              <div key={appointment._id} className={`appointment-card ${appointment.status}`}>
                <div className="appointment-header">
                  <div>
                    <h3>{appointment.doctorName}</h3>
                    <p className="specialty">{appointment.specialty || 'General'}</p>
                  </div>
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="appointment-details">
                  <div className="detail-item">
                    <Calendar size={18} />
                    <span>{formatDate(appointment.appointmentDate)}</span>
                  </div>

                  <div className="detail-item">
                    <Clock size={18} />
                    <span>{appointment.timeSlot}</span>
                  </div>

                  <div className="detail-item">
                    <FileText size={18} />
                    <span>{appointment.reasonForVisit || appointment.reason || 'No reason provided'}</span>
                  </div>

                  {appointment.fee && (
                    <div className="detail-item">
                      <span><strong>Consultation Fee:</strong> ₹{appointment.fee}</span>
                    </div>
                  )}
                </div>

                <div className="appointment-footer">
                  <small>Booked on: {new Date(appointment.createdAt).toLocaleString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
