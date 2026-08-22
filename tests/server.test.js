const express = require('express');
const connectDB = require('../config/db');
const initCPUMonitor = require('../utils/cpuMonitor');

// 1. Mock dependencies
jest.mock('../config/db', () => jest.fn());
jest.mock('../utils/cpuMonitor', () => jest.fn());

// 2. Mock Express internally to avoid initialization errors
jest.mock('express', () => {
    const requireActual = jest.requireActual('express');
    
    // Create the mock app directly inside the factory
    const app = {
        use: jest.fn(),
        listen: jest.fn()
    };
    
    const mockExpress = jest.fn(() => app);
    mockExpress.json = requireActual.json;
    mockExpress.urlencoded = requireActual.urlencoded;
    mockExpress.Router = requireActual.Router;
    
    return mockExpress;
});

describe('Server Initialization', () => {
    let app;

    beforeAll(() => {
        // Suppress console logs during the test
        jest.spyOn(console, 'log').mockImplementation(() => {});
        
        // Require server.js to trigger the startup logic
        require('../server');
        
        // Grab the mock instance that was created when server.js called express()
        app = express();
    });

    it('should call connectDB to initialize MongoDB', () => {
        expect(connectDB).toHaveBeenCalledTimes(1);
    });

    it('should initialize the CPU Monitor', () => {
        expect(initCPUMonitor).toHaveBeenCalledTimes(1);
    });

    it('should attempt to start the server on a port', () => {
        expect(app.listen).toHaveBeenCalled();
    });
});