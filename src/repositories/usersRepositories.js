import { connection } from "../database/database.js";

async function searchUser(startsWith) {
    const query = `SELECT"pictureUrl", name FROM users WHERE (lower(name) LIKE '${startsWith}%') ORDER BY name LIMIT5`
    return connection.query(query)

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