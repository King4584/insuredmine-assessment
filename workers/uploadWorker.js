const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Agent = require('../models/Agent');
const User = require('../models/User');
const UserAccount = require('../models/UserAccount');
const LOB = require('../models/LOB');
const Carrier = require('../models/Carrier');
const Policy = require('../models/Policy');

async function processCSV() {
  await mongoose.connect(workerData.mongoUri);
  const rows = [];

  fs.createReadStream(workerData.filePath)
    .pipe(csv())
    .on('data', (data) => rows.push(data))
    .on('end', async () => {
      try {
        for (const row of rows) {
          // Normalize and insert based on actual CSV columns
          let agent = row.agent ? await Agent.findOneAndUpdate({ agentName: row.agent }, { agentName: row.agent }, { upsert: true, new: true }) : null;
          
          let user = await User.findOneAndUpdate(
            { firstName: row.firstname, phone: row.phone }, 
            { firstName: row.firstname, dob: row.dob, address: row.address, phone: row.phone, state: row.state, zip: row.zip, email: row.email, gender: row.gender, userType: row.userType }, 
            { upsert: true, new: true }
          );

          if (row.account_name) await UserAccount.findOneAndUpdate({ accountName: row.account_name, userId: user._id }, { accountName: row.account_name, userId: user._id }, { upsert: true });
          
          let lob = row.category_name ? await LOB.findOneAndUpdate({ categoryName: row.category_name }, { categoryName: row.category_name }, { upsert: true, new: true }) : null;
          
          let carrier = row.company_name ? await Carrier.findOneAndUpdate({ companyName: row.company_name }, { companyName: row.company_name }, { upsert: true, new: true }) : null;

          if (row.policy_number) {
            await Policy.findOneAndUpdate(
              { policyNumber: row.policy_number },
              { policyNumber: row.policy_number, policyStartDate: row.policy_start_date, policyEndDate: row.policy_end_date, policyCategoryId: lob?._id, companyId: carrier?._id, userId: user._id },
              { upsert: true }
            );
          }
        }
        if (fs.existsSync(workerData.filePath)) fs.unlinkSync(workerData.filePath);
        parentPort.postMessage({ status: 'success', count: rows.length });
      } catch (err) {
        parentPort.postMessage({ status: 'error', error: err.message });
      } finally {
        await mongoose.disconnect();
      }
    });
}
processCSV();