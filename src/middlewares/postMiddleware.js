import { connection } from "../database/database.js";

async function validateCreatePostSchema(req, res, next) {


    //CASO A ROTA TENHA PARAMS
    const isValidUrl = urlString => {
        var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
        return !!urlPattern.test(urlString);
    }
    const validation = isValidUrl(req.body.link);
    if (!validation) {
        return res.status(422).send({ message: "url invalida" });
    }

    // CASO A ROTA TENHA PARAMS
    const { id } = req.params;
    try {
        const getPosts = await connection.query(
            'SELECT * FROM posts WHERE id = $1', [
            id,
        ]);
        if (id && getPosts.rowCount === 0) {
            return res.status(404).send({ message: "post não encontrado" })
        }

    } catch (error) {
        return res.status(501).send({ message: error.message })
    }

    next();
}


async function validateDeletePost(req, res, next){
    const { id } = req.params;
    try {
        const getPosts = await connection.query(
            'SELECT * FROM posts WHERE id = $1', [
            id,
        ]);
        if (id && getPosts.rowCount === 0) {
            return res.status(404).send({ message: "post não encontrado" })
        }

    } catch (error) {
        return res.status(501).send({ message: error.message })
    }

    next();
}
export { validateCreatePostSchema, validateDeletePost };