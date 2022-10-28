import dayjs from "dayjs";
import { connection } from "../database/database.js";
import { postRepository } from "../repositories/postRepositories.js";

async function CreatePost(req, res) {
  const { text, link } = req.body;
  const { userId } = res.locals;

  const hashtagsArray = [];
  await text.split(" ").forEach((value) => {
    if (value[0] === "#") {
      hashtagsArray.push(value.replace("#", ""));
    }
  });

  try {
    await postRepository.insertPost(userId, text, link);
    const getPost = await connection.query(
      `
    SELECT * FROM posts 
    WHERE posts."userId" = $1`,
      [userId]
    );

    if (hashtagsArray.length !== 0) {
      for (let i = 0; i < hashtagsArray.length; i++) {
        const atual = hashtagsArray[i];
        const isHashtagExists = await postRepository.getHashtagIdByName(atual);
        let hashtagId;
        if (isHashtagExists.rowCount !== 0) {
          hashtagId = isHashtagExists.rows[0].id;
          await insertHashPost(hashtagId, userId, text, link);
          continue;
        }

        await postRepository.insertHashtag(atual);
        const newHashtagId = await postRepository.getHashtagIdByName(atual);
        hashtagId = newHashtagId.rows[0].id;
        await insertHashPost(hashtagId, userId, text, link);
      }
    }
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
}

async function GetPost(req, res) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  try {
    const { rows: user } = await connection.query(
      `SELECT sessions."userId" FROM sessions WHERE sessions.token = $1`,
      [token]
    );

    const { userId } = user[0];

    const { rows: getPosts } = await connection.query(
      `
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
      WHERE
          l."userId" = $1

      GROUP BY
        l."postId"	   
	   
      ) j ON p.id = j."postId"

      LEFT JOIN
      (SELECT repost."postId", COUNT(repost."postId") AS "repostCount" FROM repost GROUP BY repost."postId"
    ) repost ON p.id = repost."postId"
      
      ORDER BY
        p.id DESC`,
      [userId]
    );

    // const { rows: lista } = await connection.query(`
    // SELECT

    //       json_build_object(
    //         'name', users.name,
    //         'postId', "postId") AS obj
    // FROM likes JOIN users ON
    //     likes."userId" = users.id
    // ORDER BY "postId"
    // `)

    // const {rows:lista} = await connection.query(`
    // SELECT users.name
    // FROM likes
    // JOIN users ON likes."userId"=users.id
    // WHERE likes."postId"=$1 `,[60])

    // let likers = {lista:1}

    // getPosts.forEach(async (element) => {
    //   console.log('bolinha')
    //   const { rows: lista } = await connection.query(`
    //     SELECT users.name
    //     FROM likes
    //     JOIN users ON likes."userId"=users.id
    //     WHERE likes."postId"=$1 `, [element.postId])

    //   likers = {array: lista}
    //   console.log(likers)

    // });

    // console.log(likers)

    res.status(201).send(getPosts);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function GetPostByUserId(req, res) {

  const userId = req.params.id
  const loggedUserId = res.locals.userId

  try {
    const getPosts = await connection.query(
      `SELECT
        users.name AS "username",
        users.id AS "userId",
        users."pictureUrl" AS "userImg",
        posts.id AS "postId",
        posts.text,
        posts.link,
        posts."createdAt",
        l.liked,
        f.follows AS "isFollowing"
      FROM users
      LEFT JOIN posts ON posts."userId" = users.id
      LEFT JOIN (SELECT
        likes."postId",
        COUNT(likes."postId")-1 as "liked"
        FROM likes
        GROUP BY likes."postId") l ON posts.id = l."postId"
      LEFT JOIN(SELECT
        follows 
        from follow f
        WHERE
        f.follows = $1 AND f."userId" = $2) f ON f.follows = users.id
      WHERE users.id =$1
      ORDER BY posts."createdAt"`, [userId, loggedUserId]
    )
    
    res.status(201).send(getPosts.rows);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function EditPost(req, res) {
  const { id } = req.params;
  const { text } = req.body;
  let textMessage = "";

  try {
    const getPosts = await connection.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (text) {
      textMessage = " Texto";
      const updateText = await connection.query("UPDATE posts SET text = $1 WHERE id = $2", [
        text,
        id,
      ]);
    }
    res.status(201).send({ message: `foram atualizados: ${textMessage}` });
  } catch (error) {
    res.status(404).send({ message: "url não encontrado" });
  }
}

async function DeletePost(req, res) {
  const { id } = req.params;
  try {
    // await connection.query("DELETE FROM posts WHERE id = $1", [id]);
    await postRepository.deletePost(id);
    res.status(204).send({ message: "menssagem deletada" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function insertHashPost(hashtagId, userId, text, link) {
  const postId = await postRepository.getPostId(userId, text, link);
  await connection.query('INSERT INTO "hashPost" ("postId", "hashtagId") VALUES ($1, $2)', [
    postId.rows[0].id,
    hashtagId,
  ]);
}

async function updateLike(req, res) {
  const { postId } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");

  try {
    const session = await connection.query('SELECT * FROM sessions WHERE sessions."token" = $1', [
      token,
    ]);
    const userId = session.rows[0].userId;

    console.log(userId, postId);
    await connection.query('INSERT INTO likes ("userId", "postId") VALUES ($1, $2)', [
      userId,
      postId,
    ]);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function updateDisLike(req, res) {
  const { postId } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");

  try {
    const session = await connection.query('SELECT * FROM sessions WHERE sessions."token" = $1', [
      token,
    ]);
    const userId = session.rows[0].userId;

    console.log(userId, postId);
    await connection.query('DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2', [
      userId,
      postId,
    ]);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function CreateRepost(req, res) {
  const { postId, userId } = req.body;
  try {
    await postRepository.insertRepost(postId, userId);
    res.sendStatus(200);
  } catch (error) {
    res.status(501).send({ message: error.message });
  }
}
async function getAlertNewPosts(req, res) {
  const { createdAt } = req.body;
  // console.log('CREATEAD :', req.body)
  try {
    const { rows: posts } = await connection.query(
      `
                            SELECT * FROM posts
                            WHERE posts."createdAt" > $1
                          `,
      [createdAt]
    );
    return res.status(200).send(posts.length.toString());
  } catch (error) {
    console.log("error getAlertNewPosts :", error);
    res.sendStatus(500);
  }
}

export {
  CreatePost,
  EditPost,
  DeletePost,
  GetPost,
  updateLike,
  updateDisLike,
  GetPostByUserId,
  getAlertNewPosts,
  CreateRepost,
};
