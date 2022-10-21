import { connection } from "../database/database.js";

async function addHashtag(req, res, hashtagsArray) {
  console.log("entrei");
  const { userId, text, link } = req.body;

  for (let i = 0; i <= hashtagsArray.length; i++) {
    // checkHashtagExistance();
    let atual = hashtagsArray[i];
    await connection.query(`INSERT INTO hashtags (name) VALUES ${atual}`);
  }

  return;
  // try {
  //   await connection.query("INSERT INTO hashtags (name) VALUES $1", [hashtag]);
  // } catch (error) {
  //   res.status(500).send({ message: error.message });
  // }
}

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

export { addHashtag, getHashtagPosts };
