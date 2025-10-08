import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doctorsAPI } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Stethoscope, 
  MapPin, 
  Star, 
  Calendar, 
  Search,
  Filter,
  X,
  ChevronDown,
  Award,
  GraduationCap,
  DollarSign
} from 'lucide-react';
import './DoctorsPage.css';

const DoctorsPage = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    specialty: '',
    city: '',
    minExperience: '',
    maxFee: ''
  });

  const specialties = [
    'All Specialties',
    'General Physician',
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'ENT',
    'Ophthalmology',
    'Neurology',
    'Psychiatry'
  ];

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const activeFilters = {};
      if (filters.specialty && filters.specialty !== 'All Specialties') {
        activeFilters.specialty = filters.specialty;
      }
      if (filters.city) {
        activeFilters.city = filters.city;
      }

      const response = await doctorsAPI.getAllDoctors(activeFilters);
      
      if (response.success) {
        let filteredDoctors = response.doctors || [];
        
        // Apply additional filters
        if (filters.minExperience) {
          filteredDoctors = filteredDoctors.filter(
            d => d.experience >= parseInt(filters.minExperience)
          );
        }
        
        if (filters.maxFee) {
          filteredDoctors = filteredDoctors.filter(
            d => d.consultationFee <= parseInt(filters.maxFee)
          );
        }
        
        // Apply search
        if (searchTerm) {
          filteredDoctors = filteredDoctors.filter(d =>
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setDoctors(filteredDoctors);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      specialty: '',
      city: '',
      minExperience: '',
      maxFee: ''
    });
    setSearchTerm('');
  };

  const handleBookAppointment = (doctor) => {
    navigate('/book-appointment', { state: { selectedDoctor: doctor } });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'All Specialties').length;

  if (loading) {
    return <LoadingSpinner message="Finding the best doctors for you..." />;
  }

  return (
    <div className="doctors-page">
      <div className="container">
        {/* Page Header */}
        <motion.div 
          className="page-header-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="page-header-content">
            <h1 className="page-main-title">Find Your <span className="gradient-text">Perfect Doctor</span></h1>
            <p className="page-main-description">
              Browse through our network of {doctors.length}+ qualified healthcare professionals
            </p>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div 
          className="search-filter-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="search-clear">
                <X size={16} />
              </button>
            )}
          </div>

          <button 
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="filter-badge">{activeFiltersCount}</span>
            )}
            <ChevronDown size={16} className={showFilters ? 'rotate' : ''} />
          </button>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="filters-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filters-grid">
                <div className="filter-group">
                  <label className="filter-label">
                    <Stethoscope size={16} />
                    Specialty
                  </label>
                  <select
                    value={filters.specialty}
                    onChange={(e) => handleFilterChange('specialty', e.target.value)}
                    className="filter-select"
                  >
                    {specialties.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">
                    <MapPin size={16} />
                    City
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    placeholder="Enter city name"
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">
                    <Award size={16} />
                    Min. Experience (years)
                  </label>
                  <input
                    type="number"
                    value={filters.minExperience}
                    onChange={(e) => handleFilterChange('minExperience', e.target.value)}
                    placeholder="e.g., 5"
                    className="filter-input"
                    min="0"
                  />
                </div>

                <div className="filter-group">
                  <label className="filter-label">
                    <DollarSign size={16} />
                    Max. Consultation Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={filters.maxFee}
                    onChange={(e) => handleFilterChange('maxFee', e.target.value)}
                    placeholder="e.g., 1000"
                    className="filter-input"
                    min="0"
                  />
                </div>
              </div>

              <div className="filters-actions">
                <button onClick={clearFilters} className="btn btn-secondary">
                  <X size={16} />
                  Clear All
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <motion.div 
          className="results-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p>Showing <strong>{doctors.length}</strong> doctor{doctors.length !== 1 ? 's' : ''}</p>
        </motion.div>

        {/* Doctors Grid */}
        {doctors.length === 0 ? (
          <motion.div 
            className="no-results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Stethoscope size={64} />
            <h3>No doctors found</h3>
            <p>Try adjusting your filters or search criteria</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="doctors-grid">
            {doctors.map((doctor, index) => (
              <motion.div
                key={doctor._id}
                className="doctor-card-modern"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="doctor-card-header">
                  <div className="doctor-avatar-modern">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="doctor-verified">
                    <Award size={14} />
                    <span>Verified</span>
                  </div>
                </div>

                <div className="doctor-card-body">
                  <h3 className="doctor-name">{doctor.name}</h3>
                  <p className="doctor-specialty-badge">{doctor.specialty}</p>

                  <div className="doctor-meta-grid">
                    <div className="meta-item">
                      <GraduationCap size={16} />
                      <span>{doctor.qualification}</span>
                    </div>
                    <div className="meta-item">
                      <Award size={16} />
                      <span>{doctor.experience} years exp.</span>
                    </div>
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{doctor.address?.city || 'N/A'}</span>
                    </div>
                    <div className="meta-item rating">
                      <Star size={16} fill="#fbbf24" color="#fbbf24" />
                      <span>{doctor.rating || 4.5}/5</span>
                    </div>
                  </div>

                  <div className="doctor-fee">
                    <DollarSign size={18} />
                    <span className="fee-amount">₹{doctor.consultationFee}</span>
                    <span className="fee-label">consultation fee</span>
                  </div>
                </div>

                <div className="doctor-card-footer">
                  <button 
                    onClick={() => handleBookAppointment(doctor)}
                    className="btn btn-primary btn-full"
                  >
                    <Calendar size={18} />
                    Book Appointment
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;
