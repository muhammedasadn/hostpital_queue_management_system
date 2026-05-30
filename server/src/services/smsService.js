// SMS Service (Mock implementation)
// In production, integrate with Twilio or similar service

const smsService = {
  sendTokenNotification: async (phoneNumber, tokenNumber, department) => {
    try {
      console.log(`SMS sent to ${phoneNumber}: Your token ${tokenNumber} for ${department} is ready.`);
      // In production, use Twilio or similar
      return { success: true, messageId: Math.random().toString() };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false, error: error.message };
    }
  },

  sendCalledNotification: async (phoneNumber, tokenNumber, counter) => {
    try {
      console.log(
        `SMS sent to ${phoneNumber}: Token ${tokenNumber} is being called at Counter ${counter.counterNumber}.`
      );
      return { success: true, messageId: Math.random().toString() };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false, error: error.message };
    }
  },

  sendStatusUpdate: async (phoneNumber, position, estimatedWaitTime) => {
    try {
      console.log(
        `SMS sent to ${phoneNumber}: You are at position ${position}. Estimated wait time: ${estimatedWaitTime} minutes.`
      );
      return { success: true, messageId: Math.random().toString() };
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = smsService;
