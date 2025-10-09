import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { hospitalsAPI } from '../services/api';
import { 
  Calendar, 
  Stethoscope, 
  Brain, 
  Clock, 
  Shield, 
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  Zap,
  Heart,
  Activity,
  Building2,
  MapPin
} from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Featured Hospitals Section - NEW */}
      <FeaturedHospitalsSection />
      
      {/* How It Works Section */}
      <HowItWorksSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-gradient-1"></div>
        <div className="hero-gradient-2"></div>
        <div className="hero-pattern"></div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-badge"
          >
            <Zap size={16} />
            <span>AI-Powered Healthcare Platform</span>
          </motion.div>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your Health, Our{' '}
            <span className="gradient-text">Priority</span>
            <br />
            <span className="hero-subtitle-text">
              AI-Powered Care at Your Fingertips
            </span>
          </motion.h1>
          
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Experience the future of healthcare with intelligent doctor recommendations,
            seamless appointment booking, and comprehensive health management—all in one platform.
          </motion.p>
          
          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/hospitals" className="btn btn-primary btn-xl">
              <Building2 size={20} />
              Find Hospitals
              <ArrowRight size={20} />
            </Link>
            <Link to="/doctors" className="btn btn-secondary btn-xl">
              <Stethoscope size={20} />
              Find Doctors
            </Link>
          </motion.div>

          <motion.div 
            className="hero-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="trust-item">
              <CheckCircle size={16} />
              <span>500+ Verified Doctors</span>
            </div>
            <div className="trust-item">
              <CheckCircle size={16} />
              <span>100+ Top Hospitals</span>
            </div>
            <div className="trust-item">
              <CheckCircle size={16} />
              <span>10,000+ Happy Patients</span>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="hero-card card-1">
            <div className="card-icon">
              <Heart />
            </div>
            <div className="card-content">
              <div className="card-label">Health Score</div>
              <div className="card-value">98%</div>
            </div>
            <div className="card-chart">
              <TrendingUp size={16} />
            </div>
          </div>

          <div className="hero-card card-2">
            <div className="card-icon success">
              <CheckCircle />
            </div>
            <div className="card-content">
              <div className="card-label">Appointment Confirmed</div>
              <div className="card-meta">Dr. Sarah Johnson</div>
            </div>
          </div>

          <div className="hero-card card-3">
            <div className="card-icon warning">
              <Clock />
            </div>
            <div className="card-content">
              <div className="card-label">Next Checkup</div>
              <div className="card-meta">In 2 days</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Stats Section Component
const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    { icon: Building2, value: '100+', label: 'Partner Hospitals' },
    { icon: Users, value: '10,000+', label: 'Happy Patients' },
    { icon: Stethoscope, value: '500+', label: 'Expert Doctors' },
    { icon: Award, value: '98%', label: 'Satisfaction Rate' }
  ];

  return (
    <section className="stats-section" ref={ref}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="stat-icon">
                <stat.icon />
              </div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Building2,
      title: 'Multi-Hospital Network',
      description: 'Access 100+ top hospitals across India through one unified platform. Book appointments anywhere, anytime.',
      color: 'blue'
    },
    {
      icon: Brain,
      title: 'AI Doctor Suggestions',
      description: 'Get intelligent doctor recommendations based on your symptoms using advanced machine learning algorithms.',
      color: 'purple'
    },
    {
      icon: Clock,
      title: 'Instant Booking',
      description: 'Book appointments in seconds with our streamlined, user-friendly booking process. No more waiting on hold.',
      color: 'green'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is protected with enterprise-grade security and HIPAA-compliant encryption.',
      color: 'orange'
    },
    {
      icon: Activity,
      title: 'Health Tracking',
      description: 'Monitor your health metrics, appointments, and medical history all in one centralized dashboard.',
      color: 'red'
    },
    {
      icon: Calendar,
      title: 'Smart Reminders',
      description: 'Never miss an appointment with intelligent notifications and reminder systems.',
      color: 'cyan'
    }
  ];

  return (
    <section className="features-section" ref={ref}>
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Why Choose <span className="gradient-text">HealthCare Pro</span>?
          </h2>
          <p className="section-description">
            Experience healthcare like never before with our cutting-edge features
            designed to make your journey smooth and efficient.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`feature-card feature-card-${feature.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="feature-icon-wrapper">
                <feature.icon className="feature-icon" />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Featured Hospitals Section Component - NEW
const FeaturedHospitalsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedHospitals();
  }, []);

  const fetchFeaturedHospitals = async () => {
    try {
      const response = await hospitalsAPI.getFeaturedHospitals();
      if (response.success) {
        setHospitals(response.hospitals || []);
      }
    } catch (error) {
      console.error('Error fetching featured hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || hospitals.length === 0) return null;

  return (
    <section className="featured-hospitals-section" ref={ref}>
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            Top <span className="gradient-text">Featured Hospitals</span>
          </h2>
          <p className="section-description">
            Explore our network of premium healthcare facilities
          </p>
        </motion.div>

        <div className="hospitals-carousel">
          {hospitals.slice(0, 3).map((hospital, index) => (
            <motion.div
              key={hospital._id}
              className="hospital-feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => navigate(`/hospitals/${hospital._id}`)}
            >
              <div className="hospital-card-icon">
                <Building2 size={32} />
              </div>
              
              <h3 className="hospital-card-title">{hospital.hospitalName}</h3>
              
              <div className="hospital-card-location">
                <MapPin size={16} />
                <span>{hospital.location.address.city}</span>
              </div>

              <div className="hospital-card-stats">
                <div className="stat">
                  <Users size={16} />
                  <span>{hospital.staff.totalDoctors}+ Doctors</span>
                </div>
                <div className="stat">
                  <Star size={16} fill="#fbbf24" color="#fbbf24" />
                  <span>{hospital.ratings.average.toFixed(1)}/5</span>
                </div>
              </div>

              <button className="hospital-card-btn">
                View Hospital
                <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="view-all-hospitals"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/hospitals" className="btn btn-primary btn-lg">
            <Building2 size={20} />
            View All Hospitals
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// How It Works Section Component
const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: '01',
      title: 'Browse Hospitals',
      description: 'Search through 100+ hospitals by location, specialty, and ratings. Find the perfect match.',
      icon: Building2
    },
    {
      number: '02',
      title: 'Select Doctor',
      description: 'Choose from verified doctors with detailed profiles, experience, and patient reviews.',
      icon: Stethoscope
    },
    {
      number: '03',
      title: 'Book Appointment',
      description: 'Select your preferred date and time. Get instant confirmation via email and SMS.',
      icon: Calendar
    },
    {
      number: '04',
      title: 'Get Care',
      description: 'Visit the hospital and receive quality healthcare from expert professionals.',
      icon: Heart
    }
  ];

  return (
    <section className="how-it-works-section" ref={ref}>
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="section-description">
            Get started in four simple steps and experience seamless healthcare
          </p>
        </motion.div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="step-card"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-icon">
                <step.icon />
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <ArrowRight />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section Component
const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      image: 'SJ',
      rating: 5,
      text: 'Amazing platform! I found the perfect hospital and doctor in minutes. The booking process was seamless and hassle-free.'
    },
    {
      name: 'Michael Chen',
      role: 'Business Owner',
      image: 'MC',
      rating: 5,
      text: 'Finally, a healthcare platform that actually works! No more endless phone calls. Everything is so smooth and professional.'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Teacher',
      image: 'ER',
      rating: 5,
      text: 'I love how I can compare hospitals and doctors all in one place. The AI recommendations were spot-on! Highly recommend!'
    }
  ];

  return (
    <section className="testimonials-section" ref={ref}>
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">
            What Our <span className="gradient-text">Patients Say</span>
          </h2>
          <p className="section-description">
            Join thousands of satisfied patients who trust us with their healthcare
          </p>
        </motion.div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="testimonial-stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{testimonial.image}</div>
                <div className="author-info">
                  <div className="author-name">{testimonial.name}</div>
                  <div className="author-role">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section Component
const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="cta-section" ref={ref}>
      <div className="cta-background">
        <div className="cta-gradient-1"></div>
        <div className="cta-gradient-2"></div>
      </div>
      
      <div className="container">
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="cta-title">Ready to Take Control of Your Health?</h2>
          <p className="cta-description">
            Join thousands of patients who have transformed their healthcare experience
          </p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-xl">
              <Users size={20} />
              Create Free Account
              <ArrowRight size={20} />
            </Link>
            <Link to="/hospitals" className="btn btn-secondary btn-xl">
              <Building2 size={20} />
              Explore Hospitals
            </Link>
          </div>
          <div className="cta-trust">
            <span>✓ No credit card required</span>
            <span>✓ Free forever</span>
            <span>✓ Cancel anytime</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HomePage;
