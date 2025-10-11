import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  Building2, 
  Heart, 
  Shield, 
  Clock,
  TrendingUp,
  Award,
  ArrowRight,
  Stethoscope,
  Activity,
  Zap
} from 'lucide-react';
import ScrollProgressBar from '../components/ScrollProgressBar';
import ParticleBackground from '../components/ParticleBackground';
import useCountUp from '../hooks/useCountUp';
import { initParallax } from '../utils/parallax';
import './HomePage.css';

const AnimatedStat = ({ icon: Icon, label, value, color }) => {
  const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '');
  const [count, countRef] = useCountUp(numericValue, 2500);

  return (
    <motion.div
      ref={countRef}
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        y: -5,
        rotateY: 5,
        transition: { duration: 0.2 }
      }}
      style={{ perspective: '1000px' }}
    >
      <div className="stat-icon" style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}>
        <Icon size={28} color="white" />
      </div>
      <div className="stat-content">
        <div className="stat-value">{count}{suffix}</div>
        <div className="stat-label">{label}</div>
      </div>
    </motion.div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Initialize Parallax Effect
  useEffect(() => {
    const cleanup = initParallax();
    return cleanup;
  }, []);

  const stats = [
    { icon: Building2, label: 'Hospitals', value: '28+', color: '#0066FF' },
    { icon: Users, label: 'Doctors', value: '84+', color: '#00D9C0' },
    { icon: Calendar, label: 'Appointments', value: '500+', color: '#FF6B6B' },
    { icon: Heart, label: 'Happy Patients', value: '1000+', color: '#10B981' }
  ];

  const features = [
    {
      icon: Search,
      title: 'Easy Search',
      description: 'Find doctors and hospitals near you with advanced filters',
      color: '#0066FF'
    },
    {
      icon: Calendar,
      title: 'Quick Booking',
      description: 'Book appointments in seconds with real-time availability',
      color: '#00D9C0'
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Your medical data is encrypted and completely secure',
      color: '#FF6B6B'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for your needs',
      color: '#10B981'
    }
  ];

  const specialties = [
    { name: 'Cardiology', icon: Heart, gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Neurology', icon: Activity, gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Orthopedics', icon: Stethoscope, gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Pediatrics', icon: Users, gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { name: 'Oncology', icon: Zap, gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { name: 'ENT', icon: Award, gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' }
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/hospitals?search=${searchQuery}`);
    }
  };

  return (
    <div className="homepage">
      <ScrollProgressBar />

      {/* Hero Section with Parallax */}
      <motion.section 
        className="hero-section parallax-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-background">
          <ParticleBackground />
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="container hero-content">
          <motion.div 
            className="hero-text parallax-layer"
            data-speed="0.5"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="hero-title">
              Your Health, <br />
              <span className="gradient-text">Our Priority</span>
            </h1>
            <p className="hero-description">
              Book appointments with top doctors and hospitals across India. 
              Fast, easy, and secure healthcare at your fingertips.
            </p>

            {/* Search Bar */}
            <div className="hero-search">
              <div className="search-input-wrapper">
                <MapPin className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search for hospitals, doctors, or specialties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="search-input"
                />
                <button onClick={handleSearch} className="search-button">
                  <Search size={20} />
                  Search
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <button onClick={() => navigate('/hospitals')} className="btn btn-primary">
                <Building2 size={18} />
                Find Hospitals
              </button>
              <button onClick={() => navigate('/doctors')} className="btn btn-secondary">
                <Users size={18} />
                Find Doctors
              </button>
            </div>
          </motion.div>

          <motion.div 
            className="hero-image parallax-layer"
            data-speed="0.3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="floating-card card-1">
              <Heart size={24} color="#FF6B6B" />
              <div>
                <div className="card-value">98%</div>
                <div className="card-label">Success Rate</div>
              </div>
            </div>
            <div className="floating-card card-2">
              <TrendingUp size={24} color="#10B981" />
              <div>
                <div className="card-value">24/7</div>
                <div className="card-label">Available</div>
              </div>
            </div>
            <div className="hero-illustration">
              <Stethoscope size={200} strokeWidth={1} className="illustration-icon" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section with Counter Animation */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <AnimatedStat key={index} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with 3D Tilt */}
      <section className="features-section parallax-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Why Choose Us?</h2>
            <p>Experience healthcare booking like never before</p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card tilt-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -10,
                  rotateX: 5,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="feature-icon" style={{ background: feature.color }}>
                  <feature.icon size={32} color="white" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="specialties-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Browse by Specialty</h2>
            <p>Find expert doctors in various medical fields</p>
          </motion.div>

          <div className="specialties-grid">
            {specialties.map((specialty, index) => (
              <motion.div
                key={index}
                className="specialty-card"
                style={{ background: specialty.gradient }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateZ: 5,
                  transition: { duration: 0.3 }
                }}
                onClick={() => navigate(`/doctors?specialty=${specialty.name}`)}
              >
                <specialty.icon size={40} color="white" strokeWidth={1.5} />
                <h4>{specialty.name}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container cta-content">
          <h2>Ready to book your appointment?</h2>
          <p>Join thousands of satisfied patients who trust us with their healthcare</p>
          <button onClick={() => navigate('/hospitals')} className="btn btn-cta">
            Get Started
            <ArrowRight size={20} />
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
