import categoriesSchema from "../schemas/categoriesSchema.js"; 

export default function validCategoryMiddleware(req, res, next) {

const validate = categoriesSchema.validate(req.body, {abortEarly: true })

if (validate.error) {
    res.sendStatus(422);
}
next();
}