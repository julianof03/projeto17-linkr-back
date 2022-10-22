import { connection } from "../database/database.js";
import { hashtagRepository } from "../repositories/hashtagRepositories.js";
async function getHashtagPosts(req, res) {
  const { hashtag } = req.params;
  try {
    const filteredPosts = await hashtagRepository.getHashtagPosts(hashtag);
    res.status(200).send(filteredPosts.rows);
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
