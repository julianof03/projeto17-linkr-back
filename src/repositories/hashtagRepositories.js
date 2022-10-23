import { connection } from "../database/database.js";

async function getHashtagPosts(hashtag) {
    const query = `
    SELECT 
        posts."userId",
        posts.text,
        posts.link,
        users.name,
        users."pictureUrl"
    FROM "hashPost" 
    JOIN posts ON "hashPost"."postId" = posts.id 
    JOIN hashtags ON "hashPost"."hashtagId" = hashtags.id 
    JOIN users ON posts."userId" = users.id 
    WHERE hashtags.name = $1`
    return connection.query(query, [hashtag])

}

const hashtagRepository = {
    getHashtagPosts
}

export { hashtagRepository }