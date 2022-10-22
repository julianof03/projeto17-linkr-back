import { connection } from "../database/database.js";
import {hashtagRepository} from '../repositories/hashtagRepositories.js'
async function getHashtagPosts(req, res) {
  const { hashtag } = req.params;
  try {
    // const filteredPosts = await connection.query(
    //   'SELECT posts."userId", posts.text, posts.link, users.name, users."pictureUrl" FROM "hashPost" JOIN posts ON "hashPost"."postId" = posts.id JOIN hashtags ON "hashPost"."hashtagId" = hashtags.id JOIN users ON posts."userId" = users.id WHERE hashtags.name = $1', [hashtag]
    // );

    const filteredPosts = await hashtagRepository.getHashtagPosts(hashtag)
    res.status(200).send(filteredPosts.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

export { getHashtagPosts };
