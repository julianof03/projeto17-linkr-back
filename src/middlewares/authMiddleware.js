import signUpSchema from "../schema/signUpSchema.js";
import signInSchema from "../schema/signInSchema.js";

export function validateSignUp(req, res, next){
    const customer = req.body;

    const {error} = signUpSchema.validate(customer, {abortEarly: false});

    if(error){
        const erros = error.details.map(erro => erro.message)
        return res.status(422).send(erros)
    }

    next()
};

export function validateSignIn(req, res, next){
    const customer = req.body;

    const {error} = signInSchema.validate(customer, {abortEarly: false});

    if(error){
        const erros = error.details.map(erro => erro.message)
        return res.status(422).send(erros)
    }

    next()
};