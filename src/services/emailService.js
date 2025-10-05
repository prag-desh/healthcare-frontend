import emailjs from '@emailjs/browser';

const EMAILJS_CONFIG = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_healthcare',
  templateIds: {
    appointmentConfirmation: process.env.REACT_APP_EMAILJS_CONFIRMATION_TEMPLATE || 'template_confirmation',
  },
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'your_public_key_here'
};

class EmailService {
  static init() {
    try {
      emailjs.init(EMAILJS_CONFIG.publicKey);
      console.log('EmailJS initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
      return false;
    }
  }

  static async sendConfirmationEmail(appointmentData, patientData) {
    try {
      const templateParams = {
        patient_name: patientData.patientName || `${patientData.firstName} ${patientData.lastName}`,
        patient_email: patientData.patientEmail || patientData.email,
        doctor_name: appointmentData.doctorName,
        doctor_specialty: appointmentData.specialty,
        appointment_date: this.formatDate(appointmentData.appointmentDate),
        appointment_time: appointmentData.timeSlot,
        appointment_reason: appointmentData.reason,
        confirmation_number: appointmentData.confirmationNumber || `HCS-${appointmentData.appointmentId}`,
        clinic_name: 'HealthCare Appointment Center',
        system_name: 'HealthCare Appointment System'
      };

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateIds.appointmentConfirmation,
        templateParams
      );

      return {
        success: true,
        message: 'Confirmation email sent successfully',
        response: response
      };

    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return {
        success: false,
        message: 'Failed to send confirmation email',
        error: error.message
      };
    }
  }

  static formatDate(date) {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return date.toString();
    }
  }
}

export default EmailService;
