import { connection } from "../database/database.js";

async function getHashtagPosts(hashtag) {
  const getPosts = await connection.query(
    `SELECT 
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
    ORDER BY posts."createdAt" DESC`,
    [hashtag]
  );

  const getCount = await connection.query(
    `SELECT
      likes."postId",
      COUNT(likes."postId") as "count"
      FROM likes
      GROUP BY likes."postId"`
  );
  let i = 0;
  const query = [];

  getPosts.rows.map((p) => {
    if (i > getPosts.rowCount) return;
    let j = 0;
    getCount.rows.map(() => {
      if (getCount.rows[j].postId === getPosts.rows[i].postId) {
        query.push({
          username: getPosts.rows[i].name,
          userId: getPosts.rows[i].userId,
          img: getPosts.rows[i].pictureUrl,
          text: getPosts.rows[i].text,
          link: getPosts.rows[i].link,
          likesQtd: parseInt(getCount.rows[j].count),
          liked: getPosts.rows[i].liked,
        });
      } else {
        query.push({
          username: getPosts.rows[i].name,
          userId: getPosts.rows[i].userId,
          img: getPosts.rows[i].pictureUrl,
          text: getPosts.rows[i].text,
          link: getPosts.rows[i].link,
          likesQtd: 0,
          liked: getPosts.rows[i].liked,
        });
      }
      j++;
    });
    i++;
  });

  console.log("oi " + query);

  return connection.query(query, [hashtag]);
}

const hashtagRepository = {
  getHashtagPosts,
};

export { hashtagRepository };
