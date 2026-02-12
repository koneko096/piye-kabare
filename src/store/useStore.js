import { create } from 'zustand';
import io from 'socket.io-client';
import storage from '../utils/storage';
import socketService from '../utils/socketService';
import chatUtils from '../utils/chat';

const useStore = create((set, get) => ({
  socket: null,
  userData: null,
  loggedIn: false,
  rooms: [],
  friends: [],
  messages: {}, // { roomId: [messages] }

  initSocket: (url) => {
    const socket = io(url, {
      transports: ['websocket'],
      jsonp: false,
    });

    // Centralized global listeners
    socket.on('connect', () => console.log('Socket connected'));

    socket.on('findRoom_resp', (resp) => {
      set({ rooms: chatUtils.formatRoomList(resp) });
    });

    socket.on('find_friend_resp', (resp) => {
      set({ friends: chatUtils.formatFriendList(resp) });
    });

    socket.on('receive', (resp) => {
      if (resp.roomID) {
        get().addMessage(resp.roomID, chatUtils.formatMessage(resp));
      }
    });

    set({ socket });
  },

  setUserData: (userData) => set({ userData, loggedIn: !!userData }),

  // Actions
  fetchData: () => {
    const { socket, userData } = get();
    if (!socket || !userData) return;
    chatUtils.findRoom(socket, userData.userId);
    chatUtils.findFriend(socket, userData.userId);
  },

  createRoom: (nameGroup) => {
    const { socket, userData } = get();
    if (!socket || !userData) return;
    chatUtils.createRoom(socket, { nameGroup, adminId: userData.userId });
  },

  initiateChat: (friendId, friendName) => {
    const { socket, userData } = get();
    if (!socket || !userData) return;
    chatUtils.initiateChat(socket, {
      userId1: userData.userId,
      userId2: friendId,
      nameGroup: friendName
    });
  },

  sendMessage: (roomId, content) => {
    const { socket, userData } = get();
    if (!socket || !userData) return;

    chatUtils.send(socket, {
      senderID: userData.userId,
      roomID: roomId,
      content: content
    });

    // Optimistic update
    get().addMessage(roomId, {
      _id: Math.random().toString(36).substring(7),
      text: content,
      createdAt: new Date(),
      user: { _id: userData.userId, name: userData.username || 'Me' },
    });
  },

  addMessage: (roomId, message) => {
    const currentMessages = get().messages[roomId] || [];
    const newMessages = [message, ...currentMessages];
    set((state) => ({
      messages: { ...state.messages, [roomId]: newMessages }
    }));
    // Persist
    storage.set(`chat_${roomId}`, newMessages);
  },

  loadMessages: async (roomId) => {
    const stored = await storage.get(`chat_${roomId}`);
    if (stored) {
      set((state) => ({
        messages: { ...state.messages, [roomId]: stored }
      }));
    }
  },

  login: (username, password) => {
    const { socket } = get();
    if (!socket) return;
    socketService.emit(socket, 'login', { username, password });
  },

  register: (name, username, password) => {
    const { socket } = get();
    if (!socket) return;
    socketService.emit(socket, 'register', { name, username, password });
  },

  addMember: (roomId, userId) => {
    const { socket } = get();
    if (!socket) return;
    chatUtils.addMember(socket, { roomId, userId });
  },

  kickMember: (roomId, userId) => {
    const { socket } = get();
    if (!socket) return;
    chatUtils.kickMember(socket, { roomId, userId });
  },

  logout: () => {
    const { socket } = get();
    if (socket) socket.disconnect();
    set({ socket: null, userData: null, loggedIn: false, rooms: [], friends: [], messages: {} });
  },
}));

export default useStore;
