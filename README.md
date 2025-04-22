# Simple Library App

This is a simple library app that allows user to borrow and return books.

## Tech stacks

- React + Next.js (Frontend)
- Nodejs (Backend)
- Express (Backend)
- Mongoose (ORM)
- MongoDB (Database)

## How to run the app

1. Make sure you have Node.js and MongoDB installed on your machine. If you plan to use MongoDB Atlas, make sure to create a cluster and get the connection string.
2. Clone the repository to your local machine.
3. Open `server` folder and create an `.env` file based on the `.env.example` file.
4. Run the following command in the `server` folder:
```bash
npm install
```
5. Seed the database by running `npm run seed` in the `server` folder. You should see a message like this:
```bash
User seeded successfully!
Books seeded successfully!
```
6. Start the server by running `npm start` in the `server` folder.
7. Open `client` folder and create an `.env` file based on the `.env.example` file.
8. Run the following command in the `client`:
   ```bash
   npm install
   npm run build
   ```
9. Start the client by running `npm run start` in the `client` folder.
10. Open your browser and go to `http://localhost:3000` to see the app in action.
11. For testing purposes, you can use the following credentials to log in as an admin:
    - Email: `admin@test.com`
    - Password: `teheperinko`