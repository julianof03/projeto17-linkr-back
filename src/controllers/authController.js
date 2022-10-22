import { connection } from '../database/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function signUp(req, res){

    try{
        const {email, password, name, pictureUrl} = req.body;
        
        const user = await connection.query(`
        SELECT * FROM users
        WHERE email = $1`,
        [email]);

        if(user.rows.length !== 0){
            return res.status(401).send('Email inserido já cadastrado ou inválido.');
        }

        const hashPass = bcrypt.hashSync(password, 10);

        await connection.query(`
        INSERT INTO users (email, password, name, "pictureUrl")
        VALUES ($1, $2, $3, $4)`,
        [email, hashPass, name, pictureUrl]);

        res.sendStatus(201);

    }catch(error){
        console.log(error)
        return res.sendStatus(500);
    }
};

export async function signIn(req, res){
    
    try{
        const {email, password} = req.body;
        
        const user = await connection.query(`
        SELECT * FROM users 
        WHERE email = $1`, 
        [email]);

        if(user.rows.length === 0){
            return res.sendStatus(401);
        }

        const validPass = bcrypt.compareSync(password, user.rows[0].password);

        if(!validPass){
            return res.sendStatus(401);
        }

        const secretKey = process.env.TOKEN_SECRET;
        const config = {expiresIn: 60 * 60};

        const token = jwt.sign({userId: user.rows[0].id}, secretKey, config);

        await connection.query('INSERT INTO sessions ("userId", token, "isValid") values ($1, $2, $3) ', [user.id, tokenJWT, true])

        res.send({token}).status(201);

    }catch(error){
        console.log(error.message)
        return res.sendStatus(500);
    }
};