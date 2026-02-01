## Node Project Architecture

A sample Node.js project demonstrating a **production-ready architecture** using Express, MySQL, centralized error handling, logging, and unit testing.

This project was developed with the idea to create a **full structure for scalable backend applications** in Node.js including tests, utilities, routes, middleware, and logging using best practices.

## Features

✔ MySQL integration (via `db.js`)  
✔ Express server setup (`index.js`)  
✔ Centralized error handling  using errorHandler.js and middleware
✔ Folder organization for modular code:  
- controllers  
- routes  
- middleware  
- utils  
- logs  
- tests  
✔ Logging (e.g., Winston)  
✔ Test cases using **Jest**  
✔ Security basics like Helmet (if included in code)

## Project Structure

├── controllers/          # API logic/handlers
├── routes/               # Route definitions
├── middleware/           # Express middleware (auth, errors, etc.)
├── utils/                # Utility functions/helpers
├── logs/                 # Logs & rotating log files
├── tests/                # Jest test cases
├── db.js                 # Database connection logic
├── errorHandler.js       # Central error handler
├── index.js              # App entrypoint
├── .env                  # Environment variables
├── package.json
