// controllers/usersController.js
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const getUsers = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, sortBy = 'name', order = 'asc', role, status } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const offset = (page - 1) * limit;

    // Whitelist allowed columns
    const validSortColumns = ['id', 'name', 'email', 'created_at', 'role', 'status'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'id';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    // Build WHERE clause
    let conditions = [];
    let values = [];

    if (role) {
      conditions.push('role = ?');
      values.push(role);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count query with same filters
    const [countRows] = await pool.query(`SELECT COUNT(*) as count FROM users ${whereClause}`, values);
    const totalUsers = countRows[0].count;

    // Main query
    const sql = `SELECT id, name, email, role  FROM users ${whereClause} ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
    values.push(limit, offset); // add pagination params at the end
    const [rows] = await pool.query(sql, values);

    // Response
    const responseObj = {
      currentPage: page,
      perPage: limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      data: rows,
    };

    return res.status(200).json(responseObj);
  } catch (err) {
    logger.error(`${err.message}`, { stack: err.stack });
    next(err);
  }
};

// ✅ Create user
const createUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const [userExist] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (userExist.length > 0) {
      throw new Error("User already exists");
      // return res.status(400).json({ error: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10); // saltRounds 10–12 recommended

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashPassword, role || "user"]
    );

    return res.status(201).json({
      id: result.insertId,
      name,
      email,
      role: role || "user",
      message: "User successfully created",
    });
  } catch (err) {
    logger.error(`${err.message}`, { stack: err.stack });
    next(err);
  }
};

// ✅ Login user
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const [row] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (row.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = row[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      // throw new Error("JWT_SECRET not set in environment variables");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    logger.error(`${err.message}`, { stack: err.stack });
    next(err);
  }
};

// ✅ Update user
const updateUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    if (!id) return res.status(400).json({ error: "Invalid resource access" });

    const [existing] = await pool.query("SELECT id FROM users WHERE id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ error: "User not found" });

    await pool.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, id]);

    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    logger.error(`${err.message}`, { stack: err.stack });
    next(err);
  }
};

// ✅ Delete user
const deleteUser = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id) return res.status(400).json({ error: "Invalid resource access" });

    const [existing] = await pool.query("SELECT id FROM users WHERE id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ error: "User not found" });

    const [resultSet] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (resultSet.affectedRows === 0) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    logger.error(`${err.message}`, { stack: err.stack });
    next(err);
  }
};

// ✅ Get single user
const getUserById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid resource access" });

    const [result] = await pool.query("SELECT id, name, email FROM users WHERE id = ?", [id]);
    if (result.length === 0) return res.status(404).json({ error: "User not found" });

    return res.status(200).json(result[0]);
  } catch (err) {
    logger.error(`${err.message}`, { stack: err.stack });
    next(err);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  getUserById,
  deleteUser,
  userLogin,
};
