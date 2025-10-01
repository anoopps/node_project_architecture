const express = require("express");
const helmet = require('helmet');
const app = express();
const errorHandler = require("./errorHandler");

const authenticateToken = require("./middleware/authenticateToken");

require("dotenv").config();

// Use Helmet for security headers
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);

// mount users router
const usersRouter = require("./routes/users");
app.use('/users', usersRouter);

app.use("/protected", authenticateToken, (req, res) => {
  console.log("test protected");
  res.json({ message: 'This is protected', user: req.user });
});

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));