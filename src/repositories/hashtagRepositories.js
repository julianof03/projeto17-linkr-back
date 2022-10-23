import { connection } from "../database/database.js";

async function getHashtagPosts(hashtag) {
    const query = `SELECT 
    posts.id AS "postId",
    posts.text,
    posts.link,
    users.name,
    users."pictureUrl"
    FROM posts
    JOIN users ON posts."userId" = users.id
    JOIN likes ON users.id = likes."userId"
    JOIN "hashPost" ON "hashPost"."postId" = posts.id
    JOIN hashtags ON "hashPost"."hashtagId" = hashtags.id
    WHERE hashtags.name = $1
    ORDER BY posts."createdAt"`
    return connection.query(query, [hashtag])
}

const hashtagRepository = {
    getHashtagPosts
}

export { hashtagRepository }