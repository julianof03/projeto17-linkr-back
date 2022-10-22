import { connection } from "../database/database.js";
async function getHashtagPosts(req, res) {
  const { hashtag } = req.params;
  try {
    const filteredPosts = await connection.query(
      'SELECT posts."userId", posts.text, posts.link, users.name, users."pictureUrl" FROM "hashPost" JOIN posts ON "hashPost"."postId" = posts.id JOIN hashtags ON "hashPost"."hashtagId" = hashtags.id JOIN users ON posts."userId" = users.id WHERE hashtags.name = $1',
      [hashtag]
    );
    res.status(200).send(filteredPosts.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function getTrendingHashtags(req, res) {
  try {
    const trendingHashtags = await connection.query ('SELECT hashtags.name, COUNT("hashPost"."hashtagId") AS "countMentions" from hashtags JOIN "hashPost" ON "hashPost"."hashtagId" = hashtags.id GROUP BY hashtags.name ORDER BY "countMentions" DESC LIMIT 10')
    res.status(200).send(trendingHashtags.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
export { getHashtagPosts, getTrendingHashtags };
