const osUtils = require('os-utils');
const initCPUMonitor = require('../../utils/cpuMonitor');

// Mock osUtils and process.exit
jest.mock('os-utils');
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('CPU Monitor Utility', () => {
    beforeEach(() => {
        jest.useFakeTimers(); // Intercepts setInterval
        mockExit.mockClear();
        mockConsoleWarn.mockClear();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should NOT call process.exit if CPU usage is below 70%', () => {
        // Mock CPU usage at 50%
        osUtils.cpuUsage.mockImplementation((callback) => callback(0.50));
        
        initCPUMonitor();
        
        // Fast-forward 5 seconds
        jest.advanceTimersByTime(5000);
        
        expect(mockExit).not.toHaveBeenCalled();
    });

    it('should call process.exit(1) if CPU usage hits or exceeds 70%', () => {
        // Mock CPU usage at 75%
        osUtils.cpuUsage.mockImplementation((callback) => callback(0.75));
        
        initCPUMonitor();
        
        // Fast-forward 5 seconds to trigger the interval
        jest.advanceTimersByTime(5000);
        
        expect(mockConsoleWarn).toHaveBeenCalledWith(expect.stringContaining('[ALERT] CPU'));
        expect(mockExit).toHaveBeenCalledWith(1);
    });
});