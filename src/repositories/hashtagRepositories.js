import { connection } from "../database/database.js";

async function getPostsHashtag(hashtag) {
  const postsHashtags = `
      SELECT
        p.id AS "postId",
        p.text,
        p.link,
        u."pictureUrl" AS "userImg",
        u.name AS username,
        p."userId",
        l."likesQtd",
        j."userLiked", 
        repost."repostCount"
      FROM
        posts p
      JOIN
        users u ON p."userId"= u.id
      LEFT JOIN "HashPost" ON "HashPost"."postId" = p.id
      LEFT JOIN Hashtags ON "HashPost"."hashtagId" = Hashtags.id

      LEFT JOIN
      (SELECT
        l."postId",
        COUNT(l."userId") AS "likesQtd"
      FROM
        likes l
      GROUP BY
        l."postId") l ON p.id=l."postId"

      LEFT JOIN
        (SELECT
        l."postId",
      COUNT(l."userId") AS "userLiked"
      FROM 
        likes l
      GROUP BY
        l."postId"	   
	   
      ) j ON p.id = j."postId"

      LEFT JOIN
      (SELECT repost."postId", COUNT(repost."postId") AS "repostCount" FROM repost GROUP BY repost."postId"
    ) repost ON p.id = repost."postId"
      
  WHERE Hashtags.name = $1
  ORDER BY p."createdAt" DESC`;
  return connection.query(postsHashtags, [hashtag]);
}

async function getTrending() {
  const trendingHashtags =
    'SELECT Hashtags.name, COUNT("HashPost"."hashtagId") AS "countMentions" from Hashtags JOIN "HashPost" ON "HashPost"."hashtagId" = Hashtags.id GROUP BY Hashtags.name ORDER BY "countMentions" DESC LIMIT 10';
  return connection.query(trendingHashtags);
}




const hashtagRepository = {
  getPostsHashtag,
  getTrending
};

export { hashtagRepository };
