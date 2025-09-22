# Frontend Dockerfile (frontend/Dockerfile)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (termasuk vite dan dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Create .env file for development
RUN echo 'VITE_API_URL=http://localhost:8000/api' > .env

# Expose port
EXPOSE 5173

# Start Vite development server langsung dengan npx
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173"]