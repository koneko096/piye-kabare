import { create } from 'zustand';
import io from 'socket.io-client';

const useStore = create((set, get) => ({
  socket: null,
  userData: null,
  loggedIn: false,

  initSocket: (url) => {
    const socket = io(url, {
      transports: ['websocket'],
      jsonp: false,
    });
    set({ socket });
  },

  setUserData: (userData) => set({ userData, loggedIn: !!userData }),
  setLoggedIn: (loggedIn) => set({ loggedIn }),

  logout: () => {
    const { socket } = get();
    if (socket) socket.disconnect();
    set({ socket: null, userData: null, loggedIn: false });
  },
}));

export default useStore;
