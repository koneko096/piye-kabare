import { act } from 'react-test-renderer';
import useStore from '../../store/useStore';

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
        disconnect: jest.fn(),
    })),
}));

describe('useStore zustand store', () => {
    beforeEach(() => {
        // Reset state before each test
        act(() => {
            useStore.getState().logout();
        });
    });

    it('should have initial state', () => {
        const state = useStore.getState();
        expect(state.socket).toBeNull();
        expect(state.userData).toBeNull();
        expect(state.loggedIn).toBe(false);
    });

    it('should update user data and loggedIn status', () => {
        const mockUser = { userId: '123', username: 'testuser' };
        act(() => {
            useStore.getState().setUserData(mockUser);
        });

        const state = useStore.getState();
        expect(state.userData).toEqual(mockUser);
        expect(state.loggedIn).toBe(true);
    });

    it('should logout correctly', () => {
        act(() => {
            useStore.getState().setUserData({ userId: '123' });
            useStore.getState().logout();
        });

        const state = useStore.getState();
        expect(state.userData).toBeNull();
        expect(state.loggedIn).toBe(false);
        expect(state.socket).toBeNull();
    });
    it('should handle room and friend state', () => {
        const mockRooms = [{ name: 'Room 1', id: 'r1' }];
        const mockFriends = [{ name: 'Friend 1', id: 'f1' }];

        act(() => {
            useStore.setState({ rooms: mockRooms, friends: mockFriends });
        });

        const state = useStore.getState();
        expect(state.rooms).toEqual(mockRooms);
        expect(state.friends).toEqual(mockFriends);
    });

    it('should add and persist messages', () => {
        const roomId = 'r1';
        const message = { _id: '1', text: 'Hello' };

        act(() => {
            useStore.getState().addMessage(roomId, message);
        });

        const state = useStore.getState();
        expect(state.messages[roomId]).toContainEqual(message);
    });
});
