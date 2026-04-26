const express = require('express');
const router = express.Router();
const {
  createAlarm,
  getAlarms,
  deleteAlarm,
  updateAlarm,
  triggerAlarm,
  getAlarmHistory,
} = require('../controllers/alarmController');
const { protect } = require('../middleware/auth');
const { validateAlarm } = require('../middleware/validate');

router.use(protect); // all alarm routes are protected

router.route('/')
  .get(getAlarms)
  .post(validateAlarm, createAlarm);

router.get('/history', getAlarmHistory);

router.route('/:id')
  .put(updateAlarm)
  .delete(deleteAlarm);

router.post('/:id/trigger', triggerAlarm);

module.exports = router;
