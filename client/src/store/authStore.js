import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: sessionStorage.getItem('accessToken') || null,

  setAuth: (user, accessToken) => {
    sessionStorage.setItem('accessToken', accessToken);
    set({ user, accessToken });
  },

  clearAuth: () => {
    sessionStorage.removeItem('accessToken');
    set({ user: null, accessToken: null });
  },
}));

export default useAuthStore;
