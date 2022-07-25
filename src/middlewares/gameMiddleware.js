import gamesSchema from "../schemas/gamesSchema.js"; 

export default function validGameMiddleware(req, res, next) {

const validate = gamesSchema.validate(req.body, {abortEarly: true })

if (validate.error) {
    res.sendStatus(422);
}
next();
}