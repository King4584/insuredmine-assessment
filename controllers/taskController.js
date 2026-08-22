const schedule = require('node-schedule');
const ScheduledMessage = require('../models/ScheduledMessage');

exports.scheduleMessage = (req, res) => {
  const { message, day, time } = req.body;
  const scheduledDate = new Date(`${day}T${time}`);

  if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
    return res.status(400).json({ success: false, message: 'Provide a valid future day (YYYY-MM-DD) and time (HH:MM:SS)' });
  }

  schedule.scheduleJob(scheduledDate, async () => {
    await ScheduledMessage.create({ message, scheduledAt: scheduledDate });
    console.log(`Message inserted at ${new Date()}`);
  });

  res.status(200).json({ success: true, message: `Scheduled for ${scheduledDate}` });
};