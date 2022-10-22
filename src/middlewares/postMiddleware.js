import { connection } from "../database/database.js";

async function validateCreatePostSchema(req, res, next) {

    const { id } = req.params;
    try {
        const getPosts = await connection.query(
            'SELECT * FROM posts WHERE id = $1', [
            id,
        ]);
        if (id && getPosts.rowCount === 0) {
            return res.status(404).send({ message: "post não encontrado" })
        }

    } catch (error) {
        return res.status(501).send({ message: error.message })
    }

    next();
}

export { validateCreatePostSchema };