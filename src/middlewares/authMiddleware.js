import signUpSchema from "../schema/signUpSchema.js";
import signInSchema from "../schema/signInSchema.js";
import jwt from 'jsonwebtoken';
import {connection} from '../database/database.js'

export function validateSignUp(req, res, next) {
    const customer = req.body;

    const { error } = signUpSchema.validate(customer, { abortEarly: false });

    if (error) {
        const erros = error.details.map(erro => erro.message)
        return res.status(422).send(erros)
    }

    next()
};

export function validateSignIn(req, res, next) {

    const customer = req.body;

    const { error } = signInSchema.validate(customer, { abortEarly: false });

    if (error) {

        const erros = error.details.map(erro => erro.message)
        return res.status(422).send(erros)
    }

    next()
};

export async function loggedUser(req, res, next) {
    const authorization = req.headers.authorization;
    console.log(req.body)

    if (!authorization || authorization.slice(0, 7) !== 'Bearer ') {

        return res.sendStatus(401);
    };

    const token = authorization.replace('Bearer ', '');
    let userId;
    try {
        const verification = jwt.verify(token, process.env.TOKEN_SECRET);
        userId = verification.userId;

    } catch (error) {
        console.log(error)
        return res.status(401).send('Invalid Token')
    }

    try {

        const hasToken = await connection.query(`
        SELECT
        "isValid"
        FROM
        sessions
        WHERE
        "userId" = $1 AND token = $2
        LIMIT
        1
        ;
        `, [userId, token]);

        if (hasToken.rows.length === 0 || !hasToken.rows[0].isValid) {
            return res.sendStatus(401);
        };

        res.locals.userId = userId;
        res.locals.token = token;
        next();

    } catch (error) {
        res.sendStatus(error);
    }
};