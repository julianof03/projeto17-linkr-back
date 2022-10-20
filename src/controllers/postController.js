import { connection } from "../database/database.js";
import dayjs from "dayjs";


async function CreatePost(req, res) {

    const { userId, text,
        link } = req.body;

    try {

        await connection.query('INSERT INTO posts ("userId", text, link, "createdAt") VALUES ($1, $2, $3, $4)', [
            userId,
            text,
            link,
            dayjs().format('YYYY-MM-DD hh:mm:ss')
        ]);
        res.sendStatus(201);

    } catch (error) {

        res.status(501).send({ message: error.message });
    
    }
}

async function GetPost(req, res){

    try {
        const getPosts = await connection.query(
            'SELECT * FROM posts'
        );

        res.status(201).send(getPosts.rows);
    } catch (error) {
        res.status(404).send({ message: "url não encontrado" });
    } 

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