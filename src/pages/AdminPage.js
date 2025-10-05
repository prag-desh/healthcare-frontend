import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { appointmentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, Clock, User, FileText, X } from 'lucide-react';
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
  }, [isAuthenticated]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentsAPI.getAppointments();
      
      if (response.success) {
        setAppointments(response.appointments || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      const response = await appointmentsAPI.cancelAppointment(appointmentId);
      
      if (response.success) {
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

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
                    <p className="specialty">{appointment.specialty}</p>
                  </div>
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="appointment-details">
                  <div className="detail-item">
                    <Calendar size={18} />
                    <span>{new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>

                  <div className="detail-item">
                    <Clock size={18} />
                    <span>{appointment.timeSlot}</span>
                  </div>

                  <div className="detail-item">
                    <FileText size={18} />
                    <span>{appointment.reason}</span>
                  </div>
                </div>

                {appointment.status === 'scheduled' && (
                  <div className="appointment-actions">
                    <button
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="btn-cancel"
                    >
                      <X size={18} />
                      Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
