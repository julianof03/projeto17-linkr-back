import joi from "joi";

const signUpSchema = joi.object(
    {
        email: joi.string().email().required(),
        password: joi.string().required(),
        name: joi.string().required(),
        pictureUrl: joi.string().uri()
    }
);

export default signUpSchema;