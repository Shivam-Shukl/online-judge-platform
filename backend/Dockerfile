# 1. Use a newer official Node.js image to fix Mongoose compatibility (Node 20+)
FROM node:20

# 2. Update the system and install GCC (for C++) and Python3
RUN apt-get update && apt-get install -y \
    g++ \
    python3 \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

# 3. Create the app directory
WORKDIR /app

# 4. Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# 5. Copy the rest of your backend code
COPY . .

# 6. Expose the port your server runs on
EXPOSE 5000

# 7. Start the server
CMD ["node", "server.js"]
