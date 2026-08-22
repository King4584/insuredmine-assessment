const express = require('express');
const multer = require('multer');
const policyController = require('../controllers/policyController');
const taskController = require('../controllers/taskController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), policyController.uploadCSV );
router.get('/search', policyController.searchPolicies);
router.get('/aggregate', policyController.aggregatePolicies);

router.post('/schedule', taskController.scheduleMessage);

module.exports = router;