---

# Backend Setup

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Tsegaye16/Hono_REST_API && cd Hono_REST_API\server\src
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

## Build and Run with Docker

1. Build the Docker image:
   ```sh
   docker-compose up --build
   ```
2. Start the containers:
   ```sh
   docker-compose up
   ```
3. Check running containers:
   ```sh
   docker ps
   ```

Your backend should now be running on `http://localhost:4001` 🚀

In order to test the end-point using swagger or postman, use the following end-points

- `GET http://localhost:4001/positions`: Get all positions
- `GET http://localhost:4001/positions/{id}`: Get a position by id
- `POST http://localhost:4001/positions`: Create a new position
- `PUT http://localhost:4001/positions/{id}`: Update a position by id
- `DELETE http://localhost:4001/positions/{id}`: Delete a position by id
