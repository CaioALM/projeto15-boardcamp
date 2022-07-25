import connection from "../database.js";


export async function listCategories(req, res) {
    try {
    const { rows: categories } = await connection.query("SELECT * FROM categories");


    if (!categories) return res.sendStatus(204);

    res.send(categories);
} catch {
    res.sendStatus(404);
}
}

export async function postCategories(req, res) {

    try{
        const { name } = req.body;

        if (!name) return res.sendStatus(400);

        const { rows: categories }  = await connection.query("SELECT * FROM categories");
  

        if ( categories.find(el => el.name === name)) return res.sendStatus(409);
           
        await connection.query("INSERT INTO categories (name) VALUES ($1)", [name]); 
        res.sendStatus(201)
   
    } catch (error) {
        res.status(500).send(error.message)
    }

}
