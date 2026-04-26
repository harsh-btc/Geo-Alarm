const mongoose = require('mongoose');

const alarmSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    locationName: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
      maxlength: [100, 'Location name cannot exceed 100 characters'],
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    radius: {
      type: Number,
      required: [true, 'Radius is required'],
      min: [50, 'Radius must be at least 50 meters'],
      max: [10000, 'Radius cannot exceed 10,000 meters'],
      default: 200,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sound: {
      type: String,
      enum: ['default', 'chime', 'beep', 'alert', 'pulse'],
      default: 'default',
    },
    triggerCount: {
      type: Number,
      default: 0,
    },
    lastTriggeredAt: {
      type: Date,
      default: null,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, 'Note cannot exceed 200 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alarm', alarmSchema);
