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
        repost."repostCount",
        repost.id AS "repostId",
        repost."userId" AS "repostUser",
        "respostUserName",
        comments."commentCount"
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
      (SELECT repost."postId", COUNT(repost."postId") AS "repostCount", repost.id, repost."userId", 
       users.name as "respostUserName"
       FROM repost 
       JOIN users on users.id = repost."userId"
       GROUP BY repost.id, "respostUserName"
      ) repost ON p.id = repost."postId"
      LEFT JOIN
      (SELECT comments."postId", COUNT(comments."postId") AS "commentCount" 
       FROM comments GROUP BY comments."postId"
        ) comments ON p.id = comments."postId"
      
      ORDER BY
        p.id DESC`, [userId]
    )

    res.status(201).send(getPosts);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function GetPostByUserId(req, res) {
  const userId = req.params.id;
  const loggedUserId = res.locals.userId;

  try {

    const { rows: getPosts } = await connection.query(
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
    res.status(201).send(getPosts);
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
    // achar post para deletar a hashtag tbm
    const { rows: post } = await connection.query(`
    SELECT * FROM posts WHERE id = $1`, [id])

    let text = post[0].text
    const hashtagsArray = [];

    await text.split(" ").forEach((value) => {
      if (value[0] === "#") {
        hashtagsArray.push(value.replace("#", ""));
      }

    });

    if (hashtagsArray.length !== 0) {

      for (let i = 0; i < hashtagsArray.length; i++) {

        const atual = hashtagsArray[i];
        const isHashtagExists = await postRepository.getHashtagIdByName(atual);
        let hashtagId;
        console.log('hashtagId')


        if (isHashtagExists.rowCount !== 0) {
          const postId = id
          console.log('2 postId', postId)

          hashtagId = isHashtagExists.rows[0].id;
          console.log('hashtagId', hashtagId)
          await postRepository.deleteHashtag(hashtagId, postId);
          console.log('3')

          continue;

        }

      }
    }


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

    await connection.query('INSERT INTO likes ("userId" ,"postId") VALUES($1, $2) ', [
      userId,
      postId,
    ]);


    res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function updateDisLike(req, res) {
  const { postId } = req.body
  const token = req.headers.authorization?.replace('Bearer ', '')

  try {
    const session = await connection.query('SELECT * FROM sessions WHERE sessions."token" = $1', [token])
    const userId = session.rows[0].userId

    await connection.query('DELETE FROM likes WHERE "userId" = $1 AND "postId" = $2', [userId, postId])

    res.sendStatus(200)
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

async function GetComments(req, res) {
  const { postId, userId } = req.params;
  try {
    const Comments = await connection.query(`
    select
    comment,
	users.id AS "userId",
    users."pictureUrl",
    users."name",
	follow.follows
    from comments
    join users on users.id = comments."userId"
	left join (SELECT follow.follows FROM follow where follow."userId" = $1 GROUP BY follow.follows
    ) follow ON users.id = follow.follows
    where "postId" = $2`,
      [userId, postId]
    );
    res.status(201).send(Comments.rows);
  } catch (error) {
    res.status(501).send({ message: error.message });
  }
}

async function getLikers(req, res) {
  const { postId } = req.params
  const { userId } = res.locals

  try {
    const { rows: likers } = await connection.query(`
    SELECT 
      u.name,
      j."isTheLiker"
    FROM likes l
    JOIN users u on u.id=l."userId"
    LEFT JOIN(
      SELECT
        u.id AS "isTheLiker"
      FROM 
        users u
      WHERE
        u.id = $2
        ) j ON u.id = j."isTheLiker"
      WHERE l."postId"=$1
      ORDER BY j."isTheLiker" NULLS LAST
    `, [postId, userId])

    console.log('likers', likers)
    let lista = []
    let frase = ''
    const numLikes = likers.length
    // FAZER A VERIFICAÇÃO DO IS THE LIKER

    // console.log('length: ',likers.length)

    if (likers.length === 0) {
      frase = 'Nenhuma curtida'
      return res.status(200).send(frase)

    }

    if (likers[0].isTheLiker) {
      // colocar você
      if (likers.length === 1) {
        frase = 'Você curtiu'
      }
      if (likers.length === 2) {
        console.log('length =1')
        lista.push('Você')
        lista = [...lista, likers[0].name]
        frase = lista.join(' e ')
        frase = frase + ` curtiram`

      }
      if (likers.length > 2) {
        lista = [likers[0].name, likers[1].name]
        frase = `Você, ${likers[0].name} e outros ${numLikes - 2} curtiram`

      }

    } else {
      // sem você
      if (likers.length === 1) {
        frase = likers[0].name + ' curtiu'
      }
      if (likers.length === 2) {
        console.log('length =1')
        lista = [likers[0].name, likers[1].name]
        frase = lista.join(' e ')
        frase = frase + ` curtiram`
      }
      if (likers.length > 2) {
        lista = [likers[0].name, likers[1].name]
        frase = lista.join(', ')
        frase = frase + ` e outros ${numLikes - 2} curtiram`
      }
    }


    res.status(200).send(frase)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)

  }
}
async function InsertComment(req, res) {
  const { postId } = req.params;
  const { userId, comment } = req.body;
  try {

    const query = await connection.query(`
    INSERT INTO comments
    ("postId", "userId", comment)
    Values ($1, $2, $3)`, [postId, userId, comment]);

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

async function getAlertNewPosts(req, res) {
  const { createdAt } = req.body
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
    console.error("error getAlertNewPosts :", error);
    res.sendStatus(500);
  }
}
export {
  CreatePost, EditPost,
  DeletePost, GetPost,
  updateLike, updateDisLike,
  GetPostByUserId, GetComments,
  InsertComment, getAlertNewPosts,
  CreateRepost, getLikers

};
