const path = require('path');
const User = require('../models/User');
const Policy = require('../models/Policy');
const Carrier = require('../models/Carrier');
const LOB = require('../models/LOB');
const { Worker } = require('worker_threads');

exports.uploadCSV = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, error: 'File is required' });
    }

    const worker = new Worker(path.resolve(__dirname, '../workers/uploadWorker.js'), {
        workerData: {
            filePath: req.file.path,
            mongoUri: process.env.MONGODB_URI
        }
    });

    worker.on('message', (result) => {
        if (result.success == "success") {
            res.status(200).json(result);
        } else {
            res.status(500).json(result);
        }
    });

    worker.on('error', (error) => {
        res.status(500).json({ success: false, error: error.message });
    });
};

exports.searchPolicies = async (req, res) => {
    try {
        const { username } = req.query;

        if(!username) {
            return res.status(400).json({ success: false, error: 'username query parameter is required' });
        }

        const users = await User.find({ 
      firstName: { $regex: username, $options: 'i' } 
    });
    const userIds = users.map(user => user._id);
        const policies = await Policy.find({ userId: { $in: userIds } }).populate('companyId').populate('policyCategoryId'); // .populate('userId')
        res.status(200).json({ success: true, data: policies });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.aggregatePolicies = async (req, res) => {
  try {
    const data = await Policy.aggregate([
      { $group: { _id: '$userId', totalPolicies: { $sum: 1 }, policies: { $push: '$policyNumber' } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 0, userName: '$user.firstName', email: '$user.email', totalPolicies: 1, policies: 1 } }
    ]);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
};
