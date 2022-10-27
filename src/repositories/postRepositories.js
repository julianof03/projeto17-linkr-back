import { connection } from "../database/database.js";

async function insertPost(userId, text, link) {
    const query = `INSERT INTO posts ("userId", text, link) VALUES ($1, $2, $3)`

    return connection.query(query, [userId, text, link])

}
async function insertLike(userId, postId) {
    const query = `INSERT INTO likes ( "userId", "postId") VALUES ($1, $2)`
    return connection.query(query, [userId, postId])

}

async function getHashtagIdByName(atual) {
    const query = "SELECT (id) from hashtags WHERE name = $1"
    return connection.query(query, [atual])
}

async function getPostId(userId, text, link) {

    const query = 'SELECT (id) from posts WHERE "userId" = $1 AND text = $2 AND link = $3 ORDER BY "createdAt" DESC LIMIT 1'
    return connection.query(query, [userId, text, link])
}

async function insertHashtag(atual) {
    const query = "INSERT INTO hashtags (name) VALUES ($1)"
    return connection.query(query, [atual])
}

// 


async function deletePost(id) {
    const query = `DELETE FROM posts WHERE id = $1`
    return connection.query(query, [id])

}

const postRepository = {
    insertPost,
    getHashtagIdByName,
    getPostId,
    insertHashtag,
    insertLike,



    deletePost


}

export { postRepository }