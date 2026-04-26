const Alarm = require('../models/Alarm');
const AlarmHistory = require('../models/AlarmHistory');
const User = require('../models/User');

// @desc    Create a new alarm
// @route   POST /api/alarms
// @access  Private
const createAlarm = async (req, res, next) => {
  try {
    const { locationName, latitude, longitude, radius, sound, note } = req.body;

    const alarm = await Alarm.create({
      userId: req.user._id,
      locationName,
      latitude,
      longitude,
      radius: radius || 200,
      sound: sound || 'default',
      note: note || '',
    });

    res.status(201).json({
      success: true,
      message: 'Alarm created successfully!',
      alarm,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all alarms for logged-in user
// @route   GET /api/alarms
// @access  Private
const getAlarms = async (req, res, next) => {
  try {
    const alarms = await Alarm.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: alarms.length,
      alarms,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an alarm
// @route   DELETE /api/alarms/:id
// @access  Private
const deleteAlarm = async (req, res, next) => {
  try {
    const alarm = await Alarm.findById(req.params.id);

    if (!alarm) {
      return res.status(404).json({
        success: false,
        message: 'Alarm not found.',
      });
    }

    if (alarm.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this alarm.',
      });
    }

    await alarm.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Alarm deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle alarm active/inactive
// @route   PUT /api/alarms/:id
// @access  Private
const updateAlarm = async (req, res, next) => {
  try {
    const alarm = await Alarm.findById(req.params.id);

    if (!alarm) {
      return res.status(404).json({
        success: false,
        message: 'Alarm not found.',
      });
    }

    if (alarm.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this alarm.',
      });
    }

    const updatedAlarm = await Alarm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Alarm updated successfully.',
      alarm: updatedAlarm,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Record alarm trigger (called from frontend when alarm fires)
// @route   POST /api/alarms/:id/trigger
// @access  Private
const triggerAlarm = async (req, res, next) => {
  try {
    const alarm = await Alarm.findById(req.params.id);

    if (!alarm) {
      return res.status(404).json({ success: false, message: 'Alarm not found.' });
    }

    if (alarm.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    // Update alarm trigger stats
    alarm.triggerCount += 1;
    alarm.lastTriggeredAt = new Date();
    await alarm.save();

    // Log to history
    await AlarmHistory.create({
      userId: req.user._id,
      alarmId: alarm._id,
      locationName: alarm.locationName,
      latitude: alarm.latitude,
      longitude: alarm.longitude,
      radius: alarm.radius,
    });

    // Update user total triggers
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { alarmsTriggered: 1 },
    });

    res.status(200).json({ success: true, message: 'Alarm trigger recorded.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get alarm history for user
// @route   GET /api/alarms/history
// @access  Private
const getAlarmHistory = async (req, res, next) => {
  try {
    const history = await AlarmHistory.find({ userId: req.user._id })
      .sort({ triggeredAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createAlarm, getAlarms, deleteAlarm, updateAlarm, triggerAlarm, getAlarmHistory };
