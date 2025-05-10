import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8081', // URL do seu servidor local
    setupNodeEvents(on, config) {
      // Configurações adicionais aqui
    },
  },
});
