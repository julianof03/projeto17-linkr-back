import { connection } from "../database/database.js";

export async function searchUsers(req,res){
    const {startsWith} = req.params;
    try {
        const users = await connection.query(`
        SELECT
        "pictureUrl", name
        FROM
            users
        WHERE
            (lower(name) LIKE '${startsWith}%') 
        ORDER BY
        name
        LIMIT
        5`);

        return res.status(200).send(users.rows)
        
    } catch (error) {
        res.status(501).send({ message: error.message });
    }
};

export async function userInfo(req,res){
    const userId = res.locals.userId;

    try {
        const user = await connection.query(`
        SELECT
            "pictureUrl"
        FROM
            users
        WHERE
            id =$1
        LIMIT
        1`,[userId]);

        return res.status(200).send(user.rows);
        
    } catch (error) {
        res.status(501).send({ message: error.message });
    }
};