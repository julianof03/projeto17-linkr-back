import joi from "joi";

function validateCreatePostSchema(req, res, next) {

    const isValidUrl = urlString => {
        var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
      '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
    return !!urlPattern.test(urlString);
    }

    const validation = isValidUrl(req.body.link);

    if (!validation) {
        return res.status(422).send({ message: "url invalida"});
    }

    if(!req.body.link){
        return res.status(404).send({message: "link não pode estar vazio"})
    }
    next()
}

export { validateCreatePostSchema };