import { connection } from "../database/database.js";
// import { hashtagRepository } from "../repositories/hashtagRepositories.js";
async function getHashtagPosts(req, res) {
  const { hashtag } = req.params;
  
  try {
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
    const filteredPosts = [];
  
    getPosts.rows.map((p) => {
      if (i > getPosts.rowCount) return;
      let j = 0;
      getCount.rows.map(() => {
        if (getCount.rows[j].postId === getPosts.rows[i].postId) {
          filteredPosts.push({
            username: getPosts.rows[i].name,
            userId: getPosts.rows[i].userId,
            img: getPosts.rows[i].pictureUrl,
            text: getPosts.rows[i].text,
            link: getPosts.rows[i].link,
            likesQtd: parseInt(getCount.rows[j].count),
            liked: getPosts.rows[i].liked,
          });
        } else {
          filteredPosts.push({
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
   
    res.status(200).send(filteredPosts);
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message });
  }
}
async function getTrendingHashtags(req, res) {
  try {
    const trendingHashtags = await connection.query(
      'SELECT hashtags.name, COUNT("hashPost"."hashtagId") AS "countMentions" from hashtags JOIN "hashPost" ON "hashPost"."hashtagId" = hashtags.id GROUP BY hashtags.name ORDER BY "countMentions" DESC LIMIT 10'
    );
    res.status(200).send(trendingHashtags.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
export { getHashtagPosts, getTrendingHashtags };
