import { hashtagRepository } from "../repositories/hashtagRepositories.js";
async function getHashtagPosts(req, res) {
  const { hashtag } = req.params;
  
  try {
    const postsHashtag = await hashtagRepository.getPostsHashtag(hashtag)
    const likesHashtag = await hashtagRepository.getLikesHashtag()
    const filteredPosts = createHashPostObject(postsHashtag, likesHashtag)

    res.status(200).send(filteredPosts);
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message });
  }
}
async function getTrendingHashtags(req, res) {
  try {
    const trendingHashtags = await hashtagRepository.getTrending()
   
    res.status(200).send(trendingHashtags.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

function createHashPostObject(postsHashtag, likesHashtag) {
  let i = 0;
  const filteredPosts = [];
  postsHashtag.rows.map((p) => {
    if (i > postsHashtag.rowCount) return;
    let j = 0;
    likesHashtag.rows.map(() => {
      if (likesHashtag.rows[j].postId === postsHashtag.rows[i].postId) {
        filteredPosts.push({
          username: postsHashtag.rows[i].name,
          userId: postsHashtag.rows[i].userId,
          img: postsHashtag.rows[i].pictureUrl,
          text: postsHashtag.rows[i].text,
          link: postsHashtag.rows[i].link,
          likesQtd: parseInt(likesHashtag.rows[j].count),
          liked: postsHashtag.rows[i].liked,
        });
      } else {
        filteredPosts.push({
          username: postsHashtag.rows[i].name,
          userId: postsHashtag.rows[i].userId,
          img: postsHashtag.rows[i].pictureUrl,
          text: postsHashtag.rows[i].text,
          link: postsHashtag.rows[i].link,
          likesQtd: 0,
          liked: postsHashtag.rows[i].liked,
        });
      }
      j++;
    });
    i++;
  });

  return filteredPosts
}
export { getHashtagPosts, getTrendingHashtags };
