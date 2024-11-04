FROM node:20-alpine

WORKDIR /be
COPY . .

# Install dependencies for backend
RUN npm install

EXPOSE 3000

# Run the application in production mode
CMD ["npm", "run", "start"]
