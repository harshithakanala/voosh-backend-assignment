# Music API Management System

This project is a backend service for managing music APIs, using MongoDB as the database. The service is deployed at [https://music-api-management.onrender.com](https://music-api-management.onrender.com).

## Project Structure

The project is organized into the following main directories:

- **db**: Contains database-related files and configurations, including data access objects and schemas.
- **api**: Contains API endpoint implementations, middleware, utils, and services.
- **types**: Contains TypeScript type definitions used across the project.
- **environment**: Contains environment configurations.

## Setup and Installation

To set up and run this project locally, follow these steps:

### Prerequisites

- Node.js (v14 or later)
- Yarn package manager
- MongoDB

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/harshithakanala/voosh-backend-assignment.git
   cd voosh-backend-assignment
   ```

2. **Install dependencies for each module**:
   ```bash
   cd db
   yarn install
   cd ../api
   yarn install
   cd ../types
   yarn install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the `environment` directory and add the following environment variables:
   ```properties
   MONGODB_URI=YOUR_MONGO_URI
   PORT=YOUR_PORT
   JWT_SECRET=YOUR_JWT_SECRET
   ```

4. **Build the project**:
   ```bash
   cd api
   yarn build
   ```

5. **Run the project**:
   ```bash
   yarn start
   ```

6. **Watch for changes** (optional):
   ```bash
   yarn watch
   ```

## Usage

You can test the APIs using Postman or any other API testing tool. Below are some example endpoints:

- **GET /users**: Fetches users details.
- **POST /signup**: Registers a user.

## Deployment

The service is deployed at [https://music-api-management.onrender.com](https://music-api-management.onrender.com).

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request.
