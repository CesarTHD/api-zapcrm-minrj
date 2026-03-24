FROM node:18

# Instalar dependências + Firebird client
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libfbclient2 \
    libfbclient-dev

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]