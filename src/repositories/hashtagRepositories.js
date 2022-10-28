import { connection } from "../database/database.js";

async function getPostsHashtag(hashtag) {
  const postsHashtags = `
  SELECT 
  posts.id AS "postId",
  posts.text,
  posts.link,
  users.name AS "username",
  users.id AS "userId",
  users."pictureUrl" AS "userImg",
  "likesQtd",
  posts."createdAt"
  FROM posts
  JOIN users ON posts."userId" = users.id
  JOIN "hashPost" ON "hashPost"."postId" = posts.id
  JOIN hashtags ON "hashPost"."hashtagId" = hashtags.id
  JOIN (
    SELECT
    likes."postId",
    COUNT(likes."postId")-1 as "likesQtd"
    FROM likes
    GROUP BY likes."postId") l ON posts.id = l."postId"
    WHERE hashtags.name = $1
  ORDER BY posts."createdAt" DESC`
  return connection.query(postsHashtags, [hashtag]);
}

async function getTrending() {
  const trendingHashtags =  'SELECT hashtags.name, COUNT("hashPost"."hashtagId") AS "countMentions" from hashtags JOIN "hashPost" ON "hashPost"."hashtagId" = hashtags.id GROUP BY hashtags.name ORDER BY "countMentions" DESC LIMIT 10'
  return connection.query(trendingHashtags);
}

const hashtagRepository = {
  getPostsHashtag,
  getTrending
};

export { hashtagRepository };
