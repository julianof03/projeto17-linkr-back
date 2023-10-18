import { hashtagRepository } from "../repositories/hashtagRepositories.js";

async function getHashtagPosts(req, res) {
  const { hashtag } = req.params;

  try {
    const postsHashtag = await hashtagRepository.getPostsHashtag(hashtag);
    res.status(200).send(postsHashtag.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
}
async function getTrendingHashtags(req, res) {
  try {
    const trendingHashtags = await hashtagRepository.getTrending();
    res.status(200).send(trendingHashtags.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

export { getHashtagPosts, getTrendingHashtags };
