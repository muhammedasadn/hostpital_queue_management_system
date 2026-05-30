// Token Service
// Handles token generation and management

const tokenService = {
  generateTokenNumber: (() => {
    let counter = 0;
    return () => {
      counter++;
      return counter;
    };
  })(),

  createToken: (patientName, department) => {
    return {
      _id: Math.random().toString(36).substr(2, 9),
      tokenNumber: tokenService.generateTokenNumber(),
      patientName,
      department,
      status: 'waiting',
      bookedAt: new Date(),
      position: 0
    };
  },

  updateTokenStatus: (token, status) => {
    token.status = status;
    token.updatedAt = new Date();
    return token;
  },

  calculateWaitTime: (position, avgTimePerToken = 5) => {
    return position * avgTimePerToken;
  }
};

module.exports = tokenService;
