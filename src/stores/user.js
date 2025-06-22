import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async login(email, password) {
      try {
        const response = await fetch('http://localhost:3000/api/v1/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          mode: 'cors'
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erreur d\'authentification');
        }

        this.user = data.user;
        this.token = data.token;
        localStorage.setItem('token', data.token);

        return data; // ✅ Retourne les données au composant Vue
      } catch (error) {
        throw error; // L'erreur sera affichée dans le composant Vue
      }
    },

    async initialize() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        try {
          const res = await fetch('http://localhost:3000/api/v1/user/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            mode: 'cors'
          });
          if (res.ok) {
            this.user = await res.json();
          } else {
            this.logout();
          }
        } catch {
          this.logout();
        }
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    }
  }
});