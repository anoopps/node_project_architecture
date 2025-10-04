const pool = require("../db");
const logger = require("../utils/logger");


const createComment = async (req, res, next) => {

    try {
        const { postId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        if (!content) {
            throw new Error("Comment missing");
        }

        // validate post existance
        let sqlQuery = "SELECT * FROM posts WHERE id =?"
        const [postExist] = await pool.query(sqlQuery, [postId]);

        if (postExist.length == 0) {
            throw new Error("Post not found");
        }

        sqlQuery = "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?);"
        const [result] = await pool.query(sqlQuery, [postId, userId, content]);

        if (!result.insertId) {
            return res.status(404).json({ error: "Comment creation Error" });
        }

        res.status(201).json({
            id: result.insertId,
            postId: postId,
            userId,
            content,
            message: "Comment added successfully"
        });

    } catch (err) {
        logger.error(`${err.message}`, { stack: err.stack })
        next(err);
    }
};

const getCommentsByPost = async (req, res, next) => {

    try {
        const { postId } = req.params;        

        const [result] = await pool.query(`SELECT c.id, c.comment, c.created_at, u.name AS userName 
            FROM comments as c 
            INNER join users as u on u.id = c.user_id 
            WHERE c.post_id = ? 
            ORDER by c.created_at ASC`, [postId]);

        const responseMessage = result.length > 0 ? 'Sucessfully fetched post comments' : 'No comments found';

        res.status(200).json({
            data: result,
            postId: postId,
            message: responseMessage
        })
    } catch (err) {
        logger.error(`${err.message}`, { stack: err.stack });
        next(err);
    }

};

module.exports = {
    createComment,
    getCommentsByPost
}