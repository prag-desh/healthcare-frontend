import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { hospitalsAPI } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Building2,
  MapPin, 
  Star, 
  Search,
  Filter,
  X,
  ChevronDown,
  Award,
  Bed,
  Users,
  ArrowRight
} from 'lucide-react';
import './HospitalsPage.css';

const HospitalsPage = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    specialty: '',
    sortBy: 'rating'
  });

  const hospitalTypes = [
    'All Types',
    'Multi-specialty',
    'Single-specialty',
    'Clinic',
    'Diagnostic Center',
    'Nursing Home'
  ];

  const specialties = [
    'All Specialties',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Oncology',
    'Pediatrics',
    'Gynecology',
    'ENT',
    'Ophthalmology'
  ];

  const fetchHospitals = useCallback(async () => {
    try {
      setLoading(true);
      const activeFilters = {};
      
      if (filters.city) activeFilters.city = filters.city;
      if (filters.type && filters.type !== 'All Types') activeFilters.type = filters.type;
      if (filters.specialty && filters.specialty !== 'All Specialties') activeFilters.specialty = filters.specialty;
      if (searchTerm) activeFilters.search = searchTerm;
      activeFilters.sortBy = filters.sortBy;

      const response = await hospitalsAPI.getAllHospitals(activeFilters);
      
      if (response.success) {
        setHospitals(response.hospitals || []);
      }
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast.error('Failed to load hospitals');
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      type: '',
      specialty: '',
      sortBy: 'rating'
    });
    setSearchTerm('');
  };

  const handleHospitalClick = (hospitalId) => {
    navigate(`/hospitals/${hospitalId}`);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'All Types' && v !== 'All Specialties' && v !== 'rating').length;

  if (loading) {
    return <LoadingSpinner message="Loading hospitals..." />;
  }

  return (
    <div className="hospitals-page">
      <div className="container">
        <motion.div 
          className="page-header-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="page-header-content">
            <h1 className="page-main-title">
              Find <span className="gradient-text">Top Hospitals</span> Near You
            </h1>
            <p className="page-main-description">
              Browse through {hospitals.length}+ verified hospitals across India
            </p>
          </div>
        </motion.div>

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
              placeholder="Search hospitals by name, city or specialty..."
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
                    <Building2 size={16} />
                    Hospital Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="filter-select"
                  >
                    {hospitalTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label className="filter-label">
                    <Award size={16} />
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="filter-select"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="newest">Newest First</option>
                  </select>
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

        <motion.div 
          className="results-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p>Showing <strong>{hospitals.length}</strong> hospital{hospitals.length !== 1 ? 's' : ''}</p>
        </motion.div>

        {hospitals.length === 0 ? (
          <motion.div 
            className="no-results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Building2 size={64} />
            <h3>No hospitals found</h3>
            <p>Try adjusting your filters or search criteria</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="hospitals-grid">
            {hospitals.map((hospital, index) => (
              <motion.div
                key={hospital._id}
                className="hospital-card-modern"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => handleHospitalClick(hospital._id)}
              >
                <div className="hospital-card-header">
                  <div className="hospital-type-badge">
                    {hospital.hospitalType}
                  </div>
                  {hospital.isFeatured && (
                    <div className="featured-badge">
                      <Award size={14} />
                      Featured
                    </div>
                  )}
                </div>

                <div className="hospital-card-body">
                  <div className="hospital-icon">
                    <Building2 size={32} />
                  </div>

                  <h3 className="hospital-name">{hospital.hospitalName}</h3>
                  
                  <div className="hospital-location">
                    <MapPin size={16} />
                    <span>{hospital.location.address.city}, {hospital.location.address.state}</span>
                  </div>

                  <div className="hospital-rating">
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                    <span className="rating-value">{hospital.ratings.average.toFixed(1)}</span>
                    <span className="rating-count">({hospital.ratings.totalReviews} reviews)</span>
                  </div>

                  <div className="hospital-stats">
                    <div className="stat-item">
                      <Users size={16} />
                      <span>{hospital.staff.totalDoctors}+ Doctors</span>
                    </div>
                    <div className="stat-item">
                      <Bed size={16} />
                      <span>{hospital.capacity.totalBeds} Beds</span>
                    </div>
                  </div>
                </div>

                <div className="hospital-card-footer">
                  <button className="btn btn-primary btn-full">
                    View Details
                    <ArrowRight size={18} />
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

export default HospitalsPage;
