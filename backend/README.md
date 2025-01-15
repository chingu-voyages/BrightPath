# Setup Instructions for the Backend

This README outlines the steps to set up the development environment for the backend of the online learning platform built with Express.js, Prisma, and PostgreSQL.

---

## Prerequisites

Before starting, ensure you have the following installed on your system:

1. **Node.js** (v18.x or later) and npm:

   - Install Node.js from [nodejs.org](https://nodejs.org/).
   - Confirm installation:
     ```bash
     node -v
     npm -v
     ```

2. **PostgreSQL** (v13.x or later):
   - Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/).
   - Set up a user and database.
   - For convenience, you can use a Docker container
     ```bash
     docker run --name myPostgresDb -p 5432:5432 -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydb -d postgres
     ```
---

## Development Instructions

### 1. Fork and clone the Repository

Fork the repository to your GitHub account including the staging branch.

Clone the repository to your local machine:

```bash
git clone <repository-url>
cd <repository-folder>
```

Switch to the staging branch:

```bash
git checkout staging
```

Please ensure you are on the staging branch before making any changes, and sync your fork with the original repository.

### 2. Install Dependencies

Install the necessary npm packages:

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the `.env.example` file:

```bash
cp .env.example .env
```

Modify the following environment variables:

```env
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database>"
PORT=3000
```

Replace `<username>`, `<password>`, and `<database>` with your PostgreSQL credentials and database name.

### 4. Set Up Prisma

1. Generate the Prisma client:

   ```bash
   npx prisma generate
   ```

2. Run the database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

### 5. Start the Development Server

Start the server in development mode:

```bash
npm run dev
```

The server should now be running at `http://localhost:3000`.

---

## Testing

To run the test suite:

1. Run the tests:
   ```bash
   npm run test
   ```

---

## Troubleshooting

### Common Issues

1. **Database Connection Error:**

   - Ensure PostgreSQL is running and the `DATABASE_URL` is correctly configured in `.env`.

2. **Prisma Client Not Generated:**

   - Run `npx prisma generate` to regenerate the Prisma client.

3. **Application Port Conflict:**
   - Change the `PORT` value in `.env` if `3000` is already in use.

---
