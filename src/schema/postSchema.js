import Joi from "joi";

export const postSchema = Joi.object({
    text: Joi.required(),
    link: Joi.string().uri().required()
});