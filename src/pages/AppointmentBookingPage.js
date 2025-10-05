import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { appointmentsAPI, doctorsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, User, FileText } from 'lucide-react';
import './AppointmentBookingPage.css';

const AppointmentBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  
  const [formData, setFormData] = useState({
    doctorId: '',
    doctorName: '',
    specialty: '',
    appointmentDate: '',
    timeSlot: '',
    reason: '',
    symptoms: ''
  });

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    fetchDoctors();

    if (location.state?.selectedDoctor) {
      const doctor = location.state.selectedDoctor;
      handleDoctorSelection(doctor);
    }
  }, [isAuthenticated, navigate, location.state]);

  const fetchDoctors = async () => {
    try {
      const response = await doctorsAPI.getAllDoctors();
      if (response.success) {
        setDoctors(response.doctors || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSelection = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData(prev => ({
      ...prev,
      doctorId: doctor._id,
      doctorName: doctor.name,
      specialty: doctor.specialty
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'doctorId') {
      const doctor = doctors.find(d => d._id === value);
      if (doctor) {
        handleDoctorSelection(doctor);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.doctorId || !formData.appointmentDate || !formData.timeSlot || !formData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.reason.length < 10) {
      toast.error('Please provide a more detailed reason');
      return;
    }

    try {
      setSubmitting(true);
      const response = await appointmentsAPI.bookAppointment(formData);

      if (response.success) {
        toast.success('Appointment booked successfully!');
        navigate('/admin');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split('T')[0];

  if (loading) {
    return <LoadingSpinner message="Loading booking form..." />;
  }

  return (
    <div className="appointment-booking-page">
      <div className="container">
        <div className="page-header">
          <h1>Book Appointment</h1>
          <p>Schedule your consultation with our expert doctors</p>
        </div>

        <div className="booking-content">
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-section">
              <h3><User size={20} /> Patient Information</h3>
              <div className="patient-info">
                <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
              </div>
            </div>

            <div className="form-section">
              <h3><User size={20} /> Select Doctor</h3>
              <div className="form-group">
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctor && (
                <div className="selected-doctor-info">
                  <p><strong>Specialty:</strong> {selectedDoctor.specialty}</p>
                  <p><strong>Experience:</strong> {selectedDoctor.experience} years</p>
                  <p><strong>Fee:</strong> ₹{selectedDoctor.consultationFee}</p>
                </div>
              )}
            </div>

            <div className="form-section">
              <h3><Calendar size={20} /> Appointment Date & Time</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    min={today}
                    max={maxDateString}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Time Slot *</label>
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3><FileText size={20} /> Reason for Visit</h3>
              <div className="form-group">
                <label>Describe your symptoms or reason *</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Please describe your concerns..."
                  className="form-textarea"
                  rows="4"
                  required
                  minLength="10"
                />
                <small>Minimum 10 characters</small>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingPage;
