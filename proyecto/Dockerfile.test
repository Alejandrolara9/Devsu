FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install jest supertest --save-dev
COPY . .
EXPOSE 4000
CMD ["npm", "test"]