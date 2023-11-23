FROM node:18

WORKDIR /app

# COPY package*.json ./
COPY . .

RUN npm install

RUN npm uninstall bcrypt

RUN npm install bcrypt

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
