import { connection } from "../database/database.js";

async function getPostsHashtag(hashtag) {
  const postsHashtags = `SELECT 
    posts.id AS "postId",
    posts.text,
    posts.link,
    users.name,
    users.id AS "userId",
    users."pictureUrl",
    likes.liked,
    posts."createdAt"
    FROM posts
    JOIN users ON posts."userId" = users.id
    JOIN likes ON users.id = likes."userId"
    JOIN "hashPost" ON "hashPost"."postId" = posts.id
    JOIN hashtags ON "hashPost"."hashtagId" = hashtags.id
    WHERE hashtags.name = $1
    ORDER BY posts."createdAt" DESC`;
  return connection.query(postsHashtags, [hashtag]);
}

async function getLikesHashtag() {
  const countLikesHashtag = `SELECT
      likes."postId",
      COUNT(likes."postId") as "count"
      FROM likes
      GROUP BY likes."postId"`;

  return connection.query(countLikesHashtag);
}

async function getTrending() {
  const trendingHashtags =  'SELECT hashtags.name, COUNT("hashPost"."hashtagId") AS "countMentions" from hashtags JOIN "hashPost" ON "hashPost"."hashtagId" = hashtags.id GROUP BY hashtags.name ORDER BY "countMentions" DESC LIMIT 10'
  return connection.query(trendingHashtags);
}

const hashtagRepository = {
  getPostsHashtag,
  getLikesHashtag,
  getTrending
};

export { hashtagRepository };
