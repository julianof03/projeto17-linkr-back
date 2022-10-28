import { connection } from "../database/database.js";

export async function timeLine(req, res) {
    console.log('timiline Controller')
    const token = req.headers.authorization?.replace("Bearer ", "");
  
    try {
      const { rows: user } = await connection.query(
        `SELECT sessions."userId" FROM sessions WHERE sessions.token = $1`,
        [token]
      );
  
      const { userId } = user[0];
  
      const { rows: getPosts } = await connection.query(
        `
	SELECT 	feed.id, feed."repostId",
			p.id as "postId", p."userId" as "postUserId", p.text, p.link,
			up."pictureUrl" AS "userImg",
			up.name AS "username",
			r."userId" as "RepostUserId",
			ur.name AS "repostUser",
			l."likesQtd",  
			j."userLiked",
		 	repost."repostCount",
		 	comments."commentCount"
	FROM feed
	LEFT JOIN repost AS r on feed."repostId" = r.id
	JOIN posts as p on feed."postId" = p.id	
	JOIN users as up on p."userId" = up.id
	JOIN users as ur on r."userId" = ur.id

-- 	LIKES QUANTIDADE
	LEFT JOIN (
		SELECT l."postId", COUNT(l."userId") AS "likesQtd"
		FROM likes l
		GROUP BY l."postId"
	) l ON p.id = l."postId"

-- USER LIKED
	LEFT JOIN 
	(
		SELECT l."postId", COUNT(l."userId") AS "userLiked"
		FROM  likes l
		WHERE l."userId" = $1
		GROUP BY l."postId"       
    ) j ON p.id = j."postId"

-- 	REPOST COUNT
	LEFT JOIN
    (
		SELECT repost."postId", COUNT(repost."postId") AS "repostCount", repost.id, repost."userId" 
     	FROM repost 
     	GROUP BY repost.id
    ) repost ON p.id = repost."postId"

-- 	COMENTARIO
	LEFT JOIN
	(
		SELECT comments."postId", COUNT(comments."postId") AS "commentCount" 
     	FROM comments GROUP BY comments."postId"
  	) comments ON p.id = comments."postId"
    `, [12]);
  
      res.status(201).send(getPosts);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  export async function repost(req, res) {
    console.log('insert no feed ', req.body)
    console.log('fui chamado pelo front')
    const {postId, userId} = req.body
    try {

    //criar repostId
        const query = `INSERT INTO repost ("postId", "userId") VALUES ($1, $2)`
        await connection.query(query, [postId, userId])

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