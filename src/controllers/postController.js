import { connection } from "../database/database.js";
import dayjs from "dayjs";


async function CreatePost(req, res) {

    const { userId, text,
        link } = req.body;

    try {

        await connection.query('INSERT INTO posts ("userId", text, link) VALUES ($1, $2, $3)', [
            userId,
            text,
            link,
        ]);
        res.sendStatus(201);

    } catch (error) {

        res.status(501).send({ message: error.message });
    
    }
}


async function GetPost(req, res){
        const getPosts = await connection.query(
            `SELECT 
            posts.id AS "postId",
            posts.text,
            posts.link,
            users.name,
            users."pictureUrl",
            likes.liked,
            posts."createdAt"
            FROM posts
            JOIN users ON posts."userId" = users.id
            JOIN likes ON users.id = likes."userId"
            ORDER BY posts."createdAt"`
        );

        const getCount = await connection.query(
            `SELECT
            likes."postId",
            COUNT(likes."postId") as "count"
            FROM likes
            GROUP BY likes."postId"`
        );

        const ArrayPost = getPosts;
        const ArrayCount = getCount;

        let i = 0;
        const BodyArray = [];
        getPosts.rows.map((p)=>{
            if(i > getPosts.rowCount) return;
            let j = 0;
            getCount.rows.map(()=>{
                if(getCount.rows[j].postId === getPosts.rows[i].postId){
                    BodyArray.push(
                        {
                            username: getPosts.rows[i].name,
                            img: getPosts.rows[i].pictureUrl,
                            text: getPosts.rows[i].text,
                            link: getPosts.rows[i].link,
                            likesQtd: parseInt(getCount.rows[j].count),
                            liked: getPosts.rows[i].liked
                        }
                    )
                }
                else{
                    BodyArray.push(
                        {
                            username: getPosts.rows[i].name,
                            img: getPosts.rows[i].pictureUrl,
                            text: getPosts.rows[i].text,
                            link: getPosts.rows[i].link,
                            likesQtd: 0,
                            liked: getPosts.rows[i].liked
                        }
                    )
                }
                j++;
            })
            i++;
        })
        res.status(201).send(BodyArray);
    

}

async function EditPost(req, res) {
    const { id } = req.params;
    const { link, text } = req.body;
    let textMessage, linkMessage = "";

    try {
        const getPosts = await connection.query(
            'SELECT * FROM posts WHERE id = $1', [
            id,
        ]);
        
        if (link) {
            linkMessage = " Link"
            const updateLink = await connection.query('UPDATE posts SET link = $1 WHERE id = $2', [
                link,
                id,
            ]);
        }
        if (text) {
            textMessage = " Texto"
            const updateText = await connection.query('UPDATE posts SET text = $1 WHERE id = $2', [
                text,
                id,
            ]);
        }

        res.status(201).send({ message: `foram atualizados:${linkMessage} ${textMessage}` });
    } catch (error) {
        res.status(404).send({ message: "url não encontrado" });
    }
}

async function DeletePost(req, res){
    const { id } = req.params;
    try {
      await connection.query("DELETE FROM posts WHERE id = $1", [id]);
      res.status(204).send({message: "menssagem deletada"});
    } catch (error) {
      res.status(501).send({ message: error.message });
    }  
}

export { CreatePost, EditPost, DeletePost, GetPost }