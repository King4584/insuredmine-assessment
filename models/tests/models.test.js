const mongoose = require('mongoose');
const User = require('../User');
const ScheduledMessage = require('../ScheduledMessage');
const Policy = require('../Policy');

describe('Mongoose Models Validation Tests', () => {

    describe('User Model', () => {
        it('should create a User successfully with valid fields', async () => {
            const validUser = new User({
                firstName: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890'
            });
            
            // Validate runs schema checks without actually saving to a real DB
            const error = validUser.validateSync(); 
            expect(error).toBeUndefined();
        });
    });

    describe('ScheduledMessage Model', () => {
        it('should fail validation if required fields are missing', async () => {
            const invalidMessage = new ScheduledMessage({}); // Missing message & scheduledAt
            const error = invalidMessage.validateSync();
            
            expect(error).toBeDefined();
            expect(error.errors['message']).toBeDefined();
            expect(error.errors['scheduledAt']).toBeDefined();
        });

        it('should pass validation with proper data', async () => {
            const validMessage = new ScheduledMessage({
                message: 'Hello World',
                scheduledAt: new Date()
            });
            const error = validMessage.validateSync();
            expect(error).toBeUndefined();
        });
    });

    describe('Policy Model', () => {
        it('should properly format ObjectId references', async () => {
            const mockUserId = new mongoose.Types.ObjectId();
            const validPolicy = new Policy({
                policyNumber: 'POL123456',
                userId: mockUserId
            });
            const error = validPolicy.validateSync();
            expect(error).toBeUndefined();
            expect(validPolicy.userId.toString()).toEqual(mockUserId.toString());
        });
    });
});