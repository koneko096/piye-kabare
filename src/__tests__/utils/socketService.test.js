import socketService from '../../utils/socketService';

describe('socketService utility', () => {
    let mockSocket;

    beforeEach(() => {
        mockSocket = {
            connected: true,
            emit: jest.fn(),
            on: jest.fn(),
            off: jest.fn(),
        };
    });

    it('should emit data when socket is connected', () => {
        socketService.emit(mockSocket, 'test_event', { data: 123 });
        expect(mockSocket.emit).toHaveBeenCalledWith('test_event', { data: 123 });
    });

    it('should not emit data when socket is not connected', () => {
        mockSocket.connected = false;
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
        socketService.emit(mockSocket, 'test_event', { data: 123 });
        expect(mockSocket.emit).not.toHaveBeenCalled();
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    it('should register listeners correctly', () => {
        const callback = jest.fn();
        socketService.on(mockSocket, 'test_event', callback);
        expect(mockSocket.on).toHaveBeenCalledWith('test_event', callback);
    });

    it('should remove listeners correctly', () => {
        const callback = jest.fn();
        socketService.off(mockSocket, 'test_event', callback);
        expect(mockSocket.off).toHaveBeenCalledWith('test_event', callback);
    });
});
