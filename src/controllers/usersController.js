import { connection } from "../database/database.js";
import { usersRepository } from '../repositories/usersRepositories.js'

export async function searchUsers(req, res) {
    const userId = res.locals.userId
    const { startsWith } = req.params;

    try {

        const users = await usersRepository.searchUser(userId,startsWith)

        return res.status(200).send(users.rows)

    } catch (error) {
        console.log(error)
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

export async function follow(req,res){
    const userId = res.locals.userId
    const follow = req.body.id
    
    try{
    const follows = await connection.query(`
    INSERT INTO
    follow ("userId", "follows")
    Values ($1,$2)
    `,[userId,follow])

    return res.sendStatus(200);
    }catch(error){
    res.status(error).send(error.message)}
    }
    
export async function unfollow(req,res){
    const userId = res.locals.userId
    const follow = req.params.id
    // console.log(follow)
    try{
    const unfollow = await connection.query(`
    DELETE FROM
    follow  WHERE "userId"=$1 AND "follows"=$2
    `,[userId,follow]);

    return res.sendStatus(200);
    }catch(error){
    res.status(error).send(error.message)}
    }
