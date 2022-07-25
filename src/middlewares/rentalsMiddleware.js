import rentalsSchema from '../schemas/rentalsSchema.js'

export default function validRentalsMiddleware (req, res, next) {   

    const validate = rentalsSchema.validate(req.body, { abortEarly: true });
  if(validate.error){
    res.sendStatus(422);
    return;
  }

  next();

}