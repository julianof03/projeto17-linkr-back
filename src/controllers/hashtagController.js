import { connection } from "../database/database.js";

//NÃO ESTÁ FINALIZADO
async function getHashtagPosts(req, res) {
  const { hashtag } = req.params;
  try {
    const filteredPosts = await connection.query("SELECT * FROM hashtags");
    res.status(200).send(filteredPosts.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

export { getHashtagPosts };
