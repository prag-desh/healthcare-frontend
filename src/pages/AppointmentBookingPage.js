import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { doctorsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, User, FileText, Building2 } from 'lucide-react';
import './AppointmentBookingPage.css';

const AppointmentBookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  
  const [formData, setFormData] = useState({
    doctorId: '',
    doctorName: '',
    specialty: '',
    experience: 0,
    fee: 0,
    hospitalId: '',
    hospitalName: '',
    appointmentDate: '',
    timeSlot: '',
    reasonForVisit: ''
  });

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  useEffect(() => {
    // Require login before booking
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment');
      navigate('/login', { state: { from: '/book-appointment' } });
      return;
    }

    fetchDoctors();

    // Get selected doctor and hospital from navigation state
    if (location.state?.selectedDoctor) {
      const doctor = location.state.selectedDoctor;
      handleDoctorSelection(doctor);
    }

    if (location.state?.selectedHospital) {
      const hospital = location.state.selectedHospital;
      setSelectedHospital(hospital);
      setFormData(prev => ({
        ...prev,
        hospitalId: hospital._id,
        hospitalName: hospital.hospitalName
      }));
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
      specialty: doctor.specialty,
      experience: doctor.experience,
      fee: doctor.consultationFee
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

    // Validation
    if (!formData.doctorId || !formData.appointmentDate || !formData.timeSlot || !formData.reasonForVisit) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.reasonForVisit.length < 10) {
      toast.error('Reason for visit must be at least 10 characters');
      return;
    }

    try {
      setSubmitting(true);

      // Use logged-in user's information
      const appointmentData = {
        patientName: `${user.firstName} ${user.lastName}`,
        patientEmail: user.email,
        doctorId: formData.doctorId,
        doctorName: formData.doctorName,
        specialty: formData.specialty,
        experience: formData.experience,
        fee: formData.fee,
        hospitalId: formData.hospitalId,
        hospitalName: formData.hospitalName,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
        reasonForVisit: formData.reasonForVisit
      };

      const response = await fetch('https://healthcare-appointment-api.onrender.com/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('✅ Appointment booked successfully!');
        // Redirect to appointments page
        navigate('/admin');
      } else {
        toast.error('❌ ' + data.message);
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to book appointment. Please try again.');
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

            {selectedHospital && (
              <div className="form-section">
                <h3><Building2 size={20} /> Hospital</h3>
                <div className="selected-hospital-info">
                  <p><strong>{selectedHospital.hospitalName}</strong></p>
                  <p>{selectedHospital.location?.address?.city}, {selectedHospital.location?.address?.state}</p>
                </div>
              </div>
            )}

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
                  name="reasonForVisit"
                  value={formData.reasonForVisit}
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
