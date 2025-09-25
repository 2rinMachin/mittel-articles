FROM node:20-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.json to the working directory
COPY package.json ./
COPY pnpm-*.yaml ./

# Install the application dependencies
RUN corepack enable pnpm
RUN pnpm install

# Copy the rest of the application files
COPY . .

# Build the NestJS application
RUN pnpm run build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]

