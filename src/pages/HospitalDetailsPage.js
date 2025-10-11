import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { hospitalsAPI } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Building2,
  MapPin, 
  Star, 
  Phone,
  Mail,
  Globe,
  Clock,
  Award,
  Bed,
  Users,
  Shield,
  CheckCircle,
  Calendar,
  ArrowLeft,
  AlertCircle,
  Heart,
  Activity
} from 'lucide-react';
import './HospitalDetailsPage.css';

const HospitalDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchHospitalDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchHospitalDetails = async () => {
  try {
    setLoading(true);
    const response = await hospitalsAPI.getHospitalById(id);
    
    if (response.success) {
      setHospital(response.hospital);
      setDoctors(response.doctors || []);
    }
  } catch (error) {
    console.error('Error fetching hospital details:', error);
    // Show error in console but keep trying
    setTimeout(fetchHospitalDetails, 2000); // Retry after 2 seconds
  } finally {
    setLoading(false);
  }
};

  const handleBookDoctor = (doctor) => {
    navigate('/book-appointment', { 
      state: { 
        selectedDoctor: doctor,
        selectedHospital: hospital
      } 
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading hospital details..." />;
  }

  if (!hospital) {
    return null;
  }

  return (
    <div className="hospital-details-page">
      {/* Hero Section */}
      <div className="hospital-hero">
        <div className="hero-overlay"></div>
        <div className="container">
          <button onClick={() => navigate('/hospitals')} className="back-button">
            <ArrowLeft size={20} />
            Back to Hospitals
          </button>

          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="hospital-hero-icon">
              <Building2 size={48} />
            </div>

            <h1 className="hospital-title">{hospital.hospitalName}</h1>
            
            <div className="hospital-meta">
              <div className="meta-item">
                <MapPin size={16} />
                <span>{hospital.location.address.city}, {hospital.location.address.state}</span>
              </div>
              
              <div className="meta-item">
                <Award size={16} />
                <span>{hospital.hospitalType}</span>
              </div>

              {hospital.operatingHours.is24x7 && (
                <div className="meta-item emergency">
                  <AlertCircle size={16} />
                  <span>24/7 Emergency Services</span>
                </div>
              )}
            </div>

            <div className="hospital-rating-hero">
              <Star size={20} fill="#fbbf24" color="#fbbf24" />
              <span className="rating-value">{hospital.ratings.average.toFixed(1)}</span>
              <span className="rating-text">({hospital.ratings.totalReviews} reviews)</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="container">
          <div className="stats-grid">
            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Users className="stat-icon" />
              <div className="stat-value">{hospital.staff.totalDoctors}+</div>
              <div className="stat-label">Expert Doctors</div>
            </motion.div>

            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Bed className="stat-icon" />
              <div className="stat-value">{hospital.capacity.totalBeds}</div>
              <div className="stat-label">Total Beds</div>
            </motion.div>

            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Activity className="stat-icon" />
              <div className="stat-value">{hospital.specialties.length}+</div>
              <div className="stat-label">Specialties</div>
            </motion.div>

            <motion.div 
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Shield className="stat-icon" />
              <div className="stat-value">{hospital.capacity.icuBeds}</div>
              <div className="stat-label">ICU Beds</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container">
        <div className="details-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'doctors' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctors')}
          >
            Doctors ({doctors.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'facilities' ? 'active' : ''}`}
            onClick={() => setActiveTab('facilities')}
          >
            Facilities
          </button>
          <button 
            className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <motion.div 
              className="overview-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="content-section">
                <h2 className="section-title">About {hospital.hospitalName}</h2>
                <p className="section-text">{hospital.description}</p>
              </div>

              <div className="content-section">
                <h2 className="section-title">Specialties</h2>
                <div className="specialties-grid">
                  {hospital.specialties.map((specialty, index) => (
                    <div key={index} className="specialty-card">
                      <Heart size={20} />
                      <span>{specialty}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="content-section">
                <h2 className="section-title">Key Highlights</h2>
                <div className="highlights-grid">
                  <div className="highlight-item">
                    <CheckCircle size={20} />
                    <span>Established in {hospital.establishedYear}</span>
                  </div>
                  <div className="highlight-item">
                    <CheckCircle size={20} />
                    <span>{hospital.capacity.operationTheaters} Operation Theaters</span>
                  </div>
                  <div className="highlight-item">
                    <CheckCircle size={20} />
                    <span>24/7 Emergency Services</span>
                  </div>
                  <div className="highlight-item">
                    <CheckCircle size={20} />
                    <span>Modern Medical Equipment</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'doctors' && (
            <motion.div 
              className="doctors-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="section-title">Our Expert Doctors</h2>
              {doctors.length === 0 ? (
                <div className="no-doctors">
                  <p>No doctors currently available at this hospital.</p>
                </div>
              ) : (
                <div className="doctors-list">
                  {doctors.map((doctor, index) => (
                    <motion.div 
                      key={doctor._id}
                      className="doctor-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="doctor-avatar">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="doctor-info">
                        <h3 className="doctor-name">{doctor.name}</h3>
                        <p className="doctor-specialty">{doctor.specialty}</p>
                        <div className="doctor-meta">
                          <span>{doctor.experience} years exp.</span>
                          <span className="separator">•</span>
                          <span>₹{doctor.consultationFee}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleBookDoctor(doctor)}
                        className="btn btn-primary"
                      >
                        <Calendar size={16} />
                        Book Now
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'facilities' && (
            <motion.div 
              className="facilities-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="section-title">Facilities & Amenities</h2>
              
              <div className="content-section">
                <h3 className="subsection-title">Medical Facilities</h3>
                <div className="facilities-grid">
                  {hospital.facilities.map((facility, index) => (
                    <div key={index} className="facility-item">
                      <CheckCircle size={18} />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="content-section">
                <h3 className="subsection-title">Amenities</h3>
                <div className="facilities-grid">
                  {hospital.amenities.map((amenity, index) => (
                    <div key={index} className="facility-item">
                      <CheckCircle size={18} />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {hospital.insuranceAccepted && hospital.insuranceAccepted.length > 0 && (
                <div className="content-section">
                  <h3 className="subsection-title">Insurance Accepted</h3>
                  <div className="insurance-list">
                    {hospital.insuranceAccepted.map((insurance, index) => (
                      <div key={index} className="insurance-item">
                        <Shield size={16} />
                        <div>
                          <div className="insurance-name">{insurance.insuranceProvider}</div>
                          <div className="insurance-type">{insurance.networkType}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div 
              className="contact-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="section-title">Contact Information</h2>
              
              <div className="contact-grid">
                <div className="contact-card">
                  <div className="contact-icon">
                    <MapPin />
                  </div>
                  <div className="contact-details">
                    <h4>Address</h4>
                    <p>
                      {hospital.location.address.street}, {hospital.location.address.area}<br />
                      {hospital.location.address.city}, {hospital.location.address.state}<br />
                      {hospital.location.address.pincode}
                    </p>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">
                    <Phone />
                  </div>
                  <div className="contact-details">
                    <h4>Phone</h4>
                    <p>{hospital.contactInfo.phone}</p>
                    {hospital.contactInfo.emergencyNumber && (
                      <p className="emergency-number">
                        Emergency: {hospital.contactInfo.emergencyNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-icon">
                    <Mail />
                  </div>
                  <div className="contact-details">
                    <h4>Email</h4>
                    <p>{hospital.contactInfo.email}</p>
                  </div>
                </div>

                {hospital.contactInfo.website && (
                  <div className="contact-card">
                    <div className="contact-icon">
                      <Globe />
                    </div>
                    <div className="contact-details">
                      <h4>Website</h4>
                      <a href={`https://${hospital.contactInfo.website}`} target="_blank" rel="noopener noreferrer">
                        {hospital.contactInfo.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="content-section">
                <h3 className="subsection-title">Operating Hours</h3>
                <div className="hours-grid">
                  <div className="hours-item">
                    <Clock size={20} />
                    <div>
                      <div className="hours-label">Weekdays</div>
                      <div className="hours-time">
                        {hospital.operatingHours.weekdays.open} - {hospital.operatingHours.weekdays.close}
                      </div>
                    </div>
                  </div>
                  <div className="hours-item">
                    <Clock size={20} />
                    <div>
                      <div className="hours-label">Weekends</div>
                      <div className="hours-time">
                        {hospital.operatingHours.weekends.open} - {hospital.operatingHours.weekends.close}
                      </div>
                    </div>
                  </div>
                </div>
                {hospital.operatingHours.is24x7 && (
                  <div className="hours-note">
                    <AlertCircle size={16} />
                    <span>Emergency services available 24/7</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalDetailsPage;
