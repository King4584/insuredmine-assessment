const osUtils = require('os-utils');

module.exports = () => {
  setInterval(() => {
    osUtils.cpuUsage((usage) => {
      if (usage >= 0.70) {
        console.warn(`[ALERT] CPU at ${(usage * 100).toFixed(2)}%. Restarting...`);
        process.exit(1); // Exits so Nodemon/PM2 automatically restarts it
      }
    });
  }, 5000); // Check every 5 seconds
};