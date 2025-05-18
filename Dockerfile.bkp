FROM node:20.12.2

# Definindo o diretório de trabalho
WORKDIR /app

# Copiando os arquivos de dependências primeiro para otimizar o cache de build
COPY package*.json ./

# Instalando as dependências
RUN npm install --no-optional --legacy-peer-deps --production && npm cache clean --force

# Copiando o restante dos arquivos
COPY . . 

# Expondo a porta da aplicação
EXPOSE 8081 

# Definindo o usuário para executar a aplicação (segurança)
USER node

# Comando para iniciar a aplicação
CMD ["npm", "start"]
