import { connection } from "../database/database.js";
import { postRepository } from "../repositories/postRepositories.js";

export async function timeLine(req, res) {
    console.log('timiline Controller')
    const token = req.headers.authorization?.replace("Bearer ", "");

    try {
      const { rows: user } = await connection.query(`
        SELECT sessions."userId" 
        FROM sessions 
        WHERE sessions.token = $1
        `,  [token] );
      const { userId } = user[0];

      const { rows: getPosts } = await connection.query(`
        SELECT 	f.id, f."repostId", f."createdAt",
          p.id as "postId", p."userId" as "postUserId", p.text, p.link,
          up."pictureUrl" AS "userImg",
          up.name AS "username",
          r."userId" as "RepostUserId",
          ur.name AS "repostUser",
          l."likesQtd",  
          j."userLiked",
          r2."repostCount",
          comments."commentCount"
        FROM feed as f
        LEFT JOIN repost AS r on f."repostId" = r.id
        JOIN posts as p on f."postId" = p.id	
        JOIN users as up on p."userId" = up.id
        LEFT JOIN users as ur on r."userId" = ur.id

          --LIKES QUANTIDADE
        LEFT JOIN (
          SELECT likes."postId", COUNT(likes."userId") AS "likesQtd"
          FROM likes
          GROUP BY likes."postId"
        ) l ON f."postId" = l."postId"

        --USER LIKED
        LEFT JOIN (
          SELECT likes."postId", COUNT(likes."userId") AS "userLiked"
          FROM  likes
          WHERE likes."userId" = $1
          GROUP BY likes."postId"       
        ) j ON f."postId" = j."postId"

        --REPOST COUNT
        LEFT JOIN(
          SELECT repost."postId", COUNT(repost."postId") AS "repostCount"
            FROM repost 
            GROUP BY repost."postId"
          ) r2 ON f."postId" = r2."postId"

        --COMENTARIO
        LEFT JOIN(
          SELECT comments."postId", COUNT(comments."postId") AS "commentCount" 
            FROM comments GROUP BY comments."postId"
          ) comments ON f."postId" = comments."postId"

        ORDER BY "createdAt" DESC
      `,  [userId]);
  
      res.status(201).send(getPosts);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

export async function repost(req, res) {
  console.log('repost controller', req.body)
  const {postId, userId} = req.body

  try {
  //criar repostId e pegar id repostId
      await connection.query(`
        INSERT INTO repost ("postId", "userId") 
        VALUES ($1, $2)
        `, [postId, userId])
      const {rows: repost} = await connection.query(`
          SELECT * FROM repost 
          WHERE repost."userId" = $1 and repost."postId" = $2
      `, [userId, postId] )

  //criar o feed {postId,repostId}
      await connection.query(`
          INSERT INTO feed("postId", "repostId")
          VALUES ($1, $2)
      `, [postId, repost[0].id])

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
  }

export async function CreatePost(req, res) {
  console.log('createPost controller')
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
      WHERE posts."userId" = $1`
      , [userId]
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

    //INSERT NO FEED
    const { rows: post } = await connection.query(`
      SELECT id FROM posts
      WHERE "userId" = $1 and "text" = $2 and "link" = $3
      `, [userId, text, link])

    await connection.query(`
      INSERT INTO feed("postId", "repostId")
      VALUES ($1, $2)
    `, [post[0].id, null])

    return res.sendStatus(201);

  } catch (error) {

    console.log(error);
    res.status(500).send({ message: error.message });

  }
  }

async function insertHashPost(hashtagId, userId, text, link) {
  const postId = await postRepository.getPostId(userId, text, link);
  await connection.query('INSERT INTO "hashPost" ("postId", "hashtagId") VALUES ($1, $2)', [
    postId.rows[0].id,
    hashtagId,])
  }