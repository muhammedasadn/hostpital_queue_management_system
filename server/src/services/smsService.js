// SMS Service (Production-Ready Mock Logger)
// In production, configure Twilio or local SMS gateway API keys in server/.env

const smsService = {
  sendTokenNotification: async (phoneNumber, tokenNumber, department) => {
    try {
      if (!phoneNumber) return { success: false, reason: 'No phone number provided' };
      
      console.log(`📱 [SMS NOTIFICATION] Sent to ${phoneNumber}: "CareQueue Pass Confirmed! Token ${tokenNumber} registered for ${department} department."`);
      return { success: true, messageId: `msg_${Date.now()}` };
    } catch (error) {
      console.error('❌ Error sending SMS notification:', error.message);
      return { success: false, error: error.message };
    }
  },

  sendCalledNotification: async (phoneNumber, tokenNumber, counterNumber) => {
    try {
      if (!phoneNumber) return { success: false, reason: 'No phone number provided' };

      console.log(`📱 [SMS CALL ALERT] Sent to ${phoneNumber}: "Token ${tokenNumber} is now being called at Counter ${counterNumber}. Please proceed to the room."`);
      return { success: true, messageId: `msg_${Date.now()}` };
    } catch (error) {
      console.error('❌ Error sending SMS call alert:', error.message);
      return { success: false, error: error.message };
    }
  },

  sendStatusUpdate: async (phoneNumber, position, estimatedWaitTime) => {
    try {
      if (!phoneNumber) return { success: false, reason: 'No phone number provided' };

      console.log(`📱 [SMS STATUS UPDATE] Sent to ${phoneNumber}: "CareQueue Alert: You are position ${position} in line. Est. Wait: ${estimatedWaitTime} mins."`);
      return { success: true, messageId: `msg_${Date.now()}` };
    } catch (error) {
      console.error('❌ Error sending SMS status update:', error.message);
      return { success: false, error: error.message };
    }
  }
};

module.exports = smsService;
