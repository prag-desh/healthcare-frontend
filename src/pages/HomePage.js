import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Stethoscope, Brain, Clock, Shield, Users } from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Your Health, Our Priority
              <span className="highlight"> AI-Powered Care</span>
            </h1>
            <p className="hero-subtitle">
              Book appointments with top doctors using AI-powered recommendations.
              Get instant suggestions based on your symptoms.
            </p>
            <div className="hero-buttons">
              <Link to="/doctors" className="btn btn-primary btn-large">
                <Stethoscope size={20} />
                Find Doctors
              </Link>
              <Link to="/book-appointment" className="btn btn-secondary btn-large">
                <Calendar size={20} />
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Brain />
              </div>
              <h3>AI Doctor Suggestions</h3>
              <p>Get intelligent doctor recommendations based on your symptoms using advanced AI</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Clock />
              </div>
              <h3>Easy Booking</h3>
              <p>Book appointments in seconds with our streamlined booking process</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Shield />
              </div>
              <h3>Secure & Private</h3>
              <p>Your health data is protected with enterprise-grade security</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Users />
              </div>
              <h3>Expert Doctors</h3>
              <p>Access to verified healthcare professionals across all specialties</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of patients who trust us with their healthcare needs</p>
            <Link to="/register" className="btn btn-primary btn-large">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
