import { defineConfig } from 'cypress';

export default defineConfig({
    projectId: "ru72o1",
  e2e: {
    baseUrl: 'http://localhost:8081', // URL do seu servidor local
    setupNodeEvents(on, config) {
      // Configurações adicionais aqui
    },
  },
});
