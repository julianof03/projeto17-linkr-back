import { connection } from '../database/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { authRepository } from '../repositories/authRepositories.js'

dotenv.config();

export async function signUp(req, res) {
    try {
        const { email, password, name, pictureUrl } = req.body;

        const user = await authRepository.getUserByEmail(email)

        if (user.rows.length !== 0) {
            return res.status(401).send('Email inserido já cadastrado ou inválido.');
        }

        const hashPass = bcrypt.hashSync(password, 10);

        await authRepository.signUp(name, email, hashPass, pictureUrl);

        res.sendStatus(201);

    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
};

export async function signIn(req, res) {

    try {
        const { email, password } = req.body;
        console.log(email, password)
        console.log("passei 01")

        const user = await authRepository.getUserByEmail(email)
        console.log("passei 02")

        if (user.rows.length === 0) {
            return res.sendStatus(401);
        }
        console.log("passei 03")
        const validPass = bcrypt.compareSync(password, user.rows[0].password);
        console.log("passei 04")
        if (!validPass) {
            return res.sendStatus(401);
        }
        console.log("passei 05")
        const secretKey = process.env.TOKEN_SECRET;
        const config = { expiresIn: 60 * 60 };

        const token = jwt.sign({ userId: user.rows[0].id }, secretKey, config);
        const userId = user.rows[0].id
        console.log("passei 06")
        await authRepository.signIn(userId, token, true)
        console.log("passei 07")

        res.status(201).send({userId, token});

    } catch (error) {
        console.log(error)
        return res.sendStatus(501);
    }
};

export async function signOut(req, res) {
    const userId = res.locals.userId;
    const token = res.locals.token;

    try {

        await authRepository.signOut(userId, token)


        return res.sendStatus(200);
    } catch (error) {
        console.log(error.message)
        return res.sendStatus(500);
    }
};