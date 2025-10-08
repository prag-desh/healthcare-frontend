import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, Zap } from 'lucide-react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading...', variant = 'default' }) => {
  if (variant === 'pulse') {
    return (
      <div className="loading-container">
        <div className="pulse-loader">
          <motion.div
            className="pulse-circle"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Heart size={32} />
          </motion.div>
        </div>
        <p className="loading-message">{message}</p>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="loading-container">
        <div className="dots-loader">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="dot"
              animate={{
                y: ["0%", "-50%", "0%"]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
        <p className="loading-message">{message}</p>
      </div>
    );
  }

  // Default spinner
  return (
    <div className="loading-container">
      <motion.div
        className="spinner-modern"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Activity size={40} />
      </motion.div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
