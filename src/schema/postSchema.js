import Joi from "joi";

export const postSchema = Joi.object({
    userId: Joi.required(),
    text: Joi.required(),
    link: Joi.string().uri().required()
});