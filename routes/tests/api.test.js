const request = require('supertest');
const express = require('express');
const apiRoutes = require('../api');

jest.mock('../../controllers/policyController', () => ({
    uploadCSV: (req, res) => {
        if (!req.file) return res.status(400).json({ success: false, error: 'File is required' });
        return res.status(200).json({ status: 'success', count: 1198 });
    },
    searchPolicies: (req, res) => {
        if (!req.query.username) {
            return res.status(400).json({ success: false, error: 'username query parameter is required' });
        }
        return res.status(200).json({ 
            success: true, 
            data: [{ policyNumber: 'YEEX9MOIBU7X', userId: 'mockId' }] 
        });
    },
    aggregatePolicies: (req, res) => {
        return res.status(200).json({ 
            success: true, 
            count: 1, 
            data: [{ totalPolicies: 2, userName: 'Lura Lucca' }] 
        });
    }
}));

jest.mock('../../controllers/taskController', () => ({
    scheduleMessage: (req, res) => {
        const { message, day, time } = req.body;
        if (!message || !day || !time) {
            return res.status(400).json({ success: false, message: 'Invalid input' });
        }
        return res.status(200).json({ success: true, message: `Scheduled for ${day} ${time}` });
    }
}));

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('API Routes Integration Tests', () => {

    describe('GET /api/search', () => {
        it('should return 400 if username query parameter is missing', async () => {
            const response = await request(app).get('/api/search');
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('username query parameter is required');
        });

        it('should return 200 and policy data when username is provided', async () => {
            const response = await request(app).get('/api/search?username=Lura');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/aggregate', () => {
        it('should return 200 and aggregated user policies', async () => {
            const response = await request(app).get('/api/aggregate');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.count).toBeDefined();
            expect(response.body.data[0].userName).toBe('Lura Lucca');
        });
    });

    describe('POST /api/schedule', () => {
        it('should return 400 if body parameters are missing', async () => {
            const response = await request(app)
                .post('/api/schedule')
                .send({ message: "Missing day and time" });
                
            expect(response.status).toBe(400);
        });

        it('should return 200 if message is successfully scheduled', async () => {
            const payload = {
                message: "Test Message",
                day: "2026-08-25",
                time: "15:30:00"
            };
            const response = await request(app)
                .post('/api/schedule')
                .send(payload);
                
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('Scheduled');
        });
    });

    describe('POST /api/upload', () => {
        it('should return 200 when a CSV file is uploaded', async () => {
            // We use .attach to simulate a multipart/form-data file upload (Multer)
            const response = await request(app)
                .post('/api/upload')
                .attach('file', Buffer.from('mock,csv,data'), 'test.csv');
                
            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
        });
    });
});