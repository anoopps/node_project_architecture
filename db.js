const mysql = require("mysql2/promise");

const pool = mysql.createPool(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306, // ✅ MySQL port, not server port
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
);

pool.getConnection()
    .then(conn => {
        console.log("Database connected");
        conn.release();
    })
    .catch(err => console.error("DB connection failed", err));

module.exports = pool;