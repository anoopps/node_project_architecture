const pool = require("../db");
const logger = require("../utils/logger");

const createPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const userId = req.user.id;

        if (!title || !content) {
            throw new Error("Title or content missing error");
        }

        const [result] = await pool.query("INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)", [userId, title, content]);

        res.status(201).json({
            id: result.insertId,
            title,
            content,
            message: "Post created successfully"
        });
    } catch (err) {
        logger.error(`${err.message}`, { stack: err.stack });
        next(err);

    }

}

const getPostsByUser = async (req, res, next) => {

    try { 
        const userId = req.params.id;
        const [rows] = await pool.query("SELECT * FROM  users WHERE id = ?", [userId]);
        // console.log(rows);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found!" });
        }

        const [postResult] = await pool.query("SELECT * FROM posts WHERE user_id = ?", [userId]);
        console.log(postResult);

        return res.status(200).json({
            user: rows[0].name,
            data: postResult,
            message: `Post created by the user ${rows[0].name}`
        });
    } catch (err) {
        logger.error(`${err.message}`, { stack: err.stack });
        next(err);
    }
}

module.exports = { createPost, getPostsByUser };
