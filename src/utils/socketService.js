/**
 * Socket Service helper to centralize common socket emissions.
 * This can be expanded to handle global listeners if needed.
 */
const socketService = {
    emit: (socket, event, data) => {
        if (socket && socket.connected) {
            socket.emit(event, data);
        } else {
            console.warn(`Socket not connected. Failed to emit: ${event}`);
        }
    },

    on: (socket, event, callback) => {
        if (socket) {
            socket.on(event, callback);
        }
    },

    off: (socket, event, callback) => {
        if (socket) {
            socket.off(event, callback);
        }
    }
};

export default socketService;
