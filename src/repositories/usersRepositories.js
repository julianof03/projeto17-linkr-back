import { connection } from "../database/database.js";

async function searchUser(userId,startsWith) {
    const query = `
    SELECT 
        u."pictureUrl", 
        u.name, 
        u.id,
        f.follows 
    FROM users u
    LEFT JOIN (
        SELECT follows
        FROM follow
        WHERE
        "userId" =$1) f ON f.follows = u.id
    WHERE (lower(u.name) LIKE '${startsWith}%')
    ORDER BY f.follows NULLS LAST
    LIMIT 5`
    return connection.query(query,[userId]);
}

async function getPicture(userId) {
    const query = `SELECT "pictureUrl" FROM users WHERE id =$1 LIMIT 1`
    return connection.query(query)

}

const usersRepository = {
    searchUser,
    getPicture
}

export { usersRepository }