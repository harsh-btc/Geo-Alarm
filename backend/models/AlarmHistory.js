const mongoose = require('mongoose');

const alarmHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    alarmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alarm',
      required: true,
    },
    locationName: {
      type: String,
      required: true,
    },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    radius: { type: Number, required: true },
    triggeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AlarmHistory', alarmHistorySchema);
