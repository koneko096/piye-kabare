import socketService from './socketService';

/**
 * Chat-related socket actions and data formatters
 */
const chatUtils = {
    // Emitters
    send: (socket, { senderID, roomID, content }) => {
        socketService.emit(socket, 'send', {
            senderID,
            roomID,
            content,
            datetime: new Date(),
        });
    },

    createRoom: (socket, { nameGroup, adminId }) => {
        socketService.emit(socket, 'create', { nameGroup, adminId });
    },

    initiateChat: (socket, { userId1, userId2, nameGroup }) => {
        socketService.emit(socket, 'chat', { userId1, userId2, nameGroup });
    },

    addMember: (socket, { roomId, userId }) => {
        socketService.emit(socket, 'add', { roomId, userId });
    },

    kickMember: (socket, { roomId, userId }) => {
        socketService.emit(socket, 'kick', { roomId, userId });
    },

    findRoom: (socket, userId) => {
        socketService.emit(socket, 'findRoom', userId);
    },

    findFriend: (socket, userId) => {
        socketService.emit(socket, 'find_friend', { userID: userId });
    },

    findMember: (socket, roomId) => {
        socketService.emit(socket, 'find_member', { roomID: roomId });
    },

    // Formatters
    formatMessage: (resp, fallbackName = 'Friend') => {
        return {
            _id: Math.random().toString(36).substring(7),
            text: resp.content,
            createdAt: new Date(resp.datetime),
            user: {
                _id: resp.senderID,
                name: fallbackName,
            },
        };
    },

    formatRoomList: (resp) => {
        if (!Array.isArray(resp)) return [];
        const uniqueRooms = [];
        const seenIds = new Set();
        resp.forEach(el => {
            if (el._id && !seenIds.has(el._id)) {
                seenIds.add(el._id);
                uniqueRooms.push({ name: el.nameGroup, id: el._id });
            }
        });
        return uniqueRooms;
    },

    formatFriendList: (resp) => {
        if (!Array.isArray(resp)) return [];
        return resp.map(el => ({ name: el.name, id: el._id }));
    }
};

export default chatUtils;
