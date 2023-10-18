import { connection } from "../database/database.js";

async function insertPost(userId, text, link) {
    const query = `INSERT INTO posts ("userId", text, link, "createdAt") VALUES ($1, $2, $3, NOW())`

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

async function deleteHashtag(hashtagId, postId) {
    const deleteHashtag =
      'DELETE FROM "hashPost" WHERE "hashtagId"= $1 AND "postId"=$2';
    return connection.query(deleteHashtag,[hashtagId, postId]);
  }

async function deletePost(id) {
    const query = `DELETE FROM posts WHERE id = $1`
    return connection.query(query, [id])
}

async function insertRepost(postId, userId) {
    console.log("cheguei no repost", " post Id:", postId, " User Id:", userId);
    const query = `INSERT INTO repost ("postId", "userId") VALUES ($1, $2)`
    return connection.query(query, [postId, userId])
}


async function getLikers(){
    const query = `
    SELECT 
        users.name,
        "postId"
    FROM likes 
    JOIN users ON likes."userId"=users.id 
    ORDER BY "postId"
    `
    return connection.query(query)
}

const postRepository = {
    insertPost,
    getHashtagIdByName,
    getPostId,
    insertHashtag,
    deleteHashtag,
    insertLike,
    insertRepost,
    deletePost,
    getLikers
}

export { postRepository }