# fastify_auth# Fastify Auth App

A simple Fastify application with MongoDB for user authentication. This project is Dockerized using `docker-compose` for easy setup.

---

##  Tech Stack

- **Fastify** – Fast and low overhead web framework
- **MongoDB** – NoSQL database for storing user data
- **Docker** – Containerization
- **Docker Compose** – Multi-container Docker apps

---


### 1. Clone the Repository

Open your terminal and run the following command to clone the project to your local machine:

```bash
git clone <your-repository-url>
```

### 2. Navigate to the Project Directory

Change into the newly created project folder:

```bash
cd fastify_auth
```

### 3. Start the Application

Use Docker Compose to build the container images and start the application. This command will read the `docker-compose.yml` file and orchestrate the services defined within it.

```bash
docker-compose up --build
```
### 4. Stopping the Application
To stop and remove the containers, you can run:

```bash
docker-compose down
```

## API Endpoints

(Optional) It's a good practice to document your API endpoints here.

| Method | Endpoint        | Description                     |
| :----- | :-------------- | :------------------------------ |
| `POST` | `/api/register` | Registers a new user.           |
| `POST` | `/api/login`    | Authenticates a user            |






