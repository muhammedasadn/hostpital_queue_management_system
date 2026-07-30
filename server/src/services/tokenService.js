const crypto = require('crypto');

let globalSequence = 1000;

const tokenService = {
  // Generate cryptographically secure UUID
  generateSecureUUID: () => {
    return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
  },

  // Get next incremental sequence
  getNextSequence: () => {
    globalSequence += 1;
    return globalSequence;
  },

  // Generate department-aware token code (e.g., GEN-1001, CAR-1002)
  generateTokenCode: (department) => {
    const prefixes = {
      'General': 'GEN',
      'Cardiology': 'CAR',
      'Neurology': 'NEU',
      'Orthopedics': 'ORT',
      'Dermatology': 'DER'
    };

    const prefix = prefixes[department] || department.substring(0, 3).toUpperCase();
    const seq = tokenService.getNextSequence();
    return `${prefix}-${seq}`;
  },

  // Reset counter sequence (e.g. at start of day)
  resetSequence: () => {
    globalSequence = 1000;
  },

  // Calculate projected wait time in minutes
  calculateEstimatedWait: (queuePosition, avgMinutesPerPatient = 5) => {
    const pos = Math.max(1, queuePosition);
    return pos * avgMinutesPerPatient;
  }
};

module.exports = tokenService;
