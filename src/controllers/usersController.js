import { connection } from "../database/database.js";
import { usersRepository } from '../repositories/usersRepositories.js'

export async function searchUsers(req, res) {
    const { startsWith } = req.params;
    try {

        const users = await usersRepository.searchUser(startsWith)

        return res.status(200).send(users.rows)

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export async function userInfo(req, res) {
    const userId = res.locals.userId;

    try {
        const user = await usersRepository.getPicture(userId)

        return res.status(200).send(user.rows[0].pictureUrl);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

