# Wishlist Wizard 🧙‍♂️

Welcome to Wishlist Wizard, your AI Academic Advisor! This full-stack application provides personalized course recommendations based on your current CGPA, completed courses, and desired difficulty level.

## Features ✨

- **Smart Recommendations**: Evaluates courses based on pre-requisites, difficulty matching, CGPA consideration, and repeat priorities.
- **Premium Interface**: A beautiful, glassmorphic UI with dynamic animated gradients built on Next.js.
- **Robust Backend**: Node.js and Express API powering the recommendation logic.
- **Database**: PostgreSQL backend containing mock course catalogs and prerequisites.

## Project Structure 📁

- `/frontend` - Next.js React application (UI)
- `/backend` - Node.js Express API server
- `/database` - PostgreSQL Docker configuration and initialization scripts

## Prerequisites 🛠️

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Docker desktop](https://www.docker.com/products/docker-desktop)

## Local Setup Instructions 🚀

Follow these steps to get the wizard ready to cast its spells on your local machine:

### 1. Database Setup

Using Docker, start the PostgreSQL database container. This will automatically run `setup.sql` to create the schema and seed mock data.

```bash
cd database
docker-compose up -d
```

### 2. Backend Setup

Start the REST API server on port 3001.

```bash
cd ../backend
npm install
npm run dev
```

### 3. Frontend Setup

In a new terminal, start the Next.js development server on port 3000.

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Magic Time!

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to start using Wishlist Wizard.

## Customizing the Course Catalog 📚

You can modify the initial course offerings and pre-requisites by editing `database/setup.sql`. Ensure you restart the Docker container with a clean volume or manually execute the updated SQL script to reflect changes.
