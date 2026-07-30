const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    required: true,
    unique: true
  },
  tokenNumber: {
    type: String,
    required: true
  },
  sequenceNumber: {
    type: Number,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['waiting', 'called', 'completed', 'cancelled'],
    default: 'waiting'
  },
  counterId: {
    type: String,
    default: null
  },
  position: {
    type: Number,
    default: 0
  },
  bookedAt: {
    type: Date,
    default: Date.now
  },
  calledAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.models.Token || mongoose.model('Token', TokenSchema);
