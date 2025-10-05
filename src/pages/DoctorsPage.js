import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorsAPI } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { Stethoscope, MapPin, Star, Calendar } from 'lucide-react';
import './DoctorsPage.css';

const DoctorsPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialty: '',
    city: ''
  });

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await doctorsAPI.getAllDoctors(filters);
      
      if (response.success) {
        setDoctors(response.doctors || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleBookAppointment = (doctor) => {
    navigate('/book-appointment', { state: { selectedDoctor: doctor } });
  };

  if (loading) {
    return <LoadingSpinner message="Loading doctors..." />;
  }

  return (
    <div className="doctors-page">
      <div className="container">
        <div className="page-header">
          <h1>Find Your Doctor</h1>
          <p>Browse through our network of qualified healthcare professionals</p>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>Specialty</label>
            <select
              name="specialty"
              value={filters.specialty}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Specialties</option>
              <option value="General Physician">General Physician</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Gynecology">Gynecology</option>
              <option value="ENT">ENT</option>
              <option value="Ophthalmology">Ophthalmology</option>
            </select>
          </div>

          <div className="filter-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Enter city"
              className="form-input"
            />
          </div>
        </div>

        {doctors.length === 0 ? (
          <div className="no-doctors">
            <Stethoscope size={64} />
            <h3>No doctors found</h3>
            <p>Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="doctor-card">
                <div className="doctor-avatar">
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <p className="specialty">{doctor.specialty}</p>
                  <p className="qualification">{doctor.qualification}</p>
                  
                  <div className="doctor-details">
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{doctor.address?.city || 'N/A'}</span>
                    </div>
                    
                    <div className="detail-item">
                      <Star size={16} />
                      <span>{doctor.rating || 0}/5</span>
                    </div>
                  </div>

                  <div className="doctor-meta">
                    <span className="experience">{doctor.experience} years exp.</span>
                    <span className="fee">₹{doctor.consultationFee}</span>
                  </div>

                  <button 
                    onClick={() => handleBookAppointment(doctor)}
                    className="btn btn-primary btn-full"
                  >
                    <Calendar size={18} />
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
