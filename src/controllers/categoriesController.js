import connection from "../database";


export async function listCategories(req, res) {
    try {
    const queryCategories = await connection.query("SELECT * FROM categories");
    const categories = queryCategories.rows[0];

    if (!categories) return res.send(204);
    
    res.send(categories);
} catch {
    res.sendStatus(404);
}
}

export async function postCategories(req, res) {

    try{
        const nameCategory = req.   body.name;

        if (!nameCategory) return res.sendStatus(400);

        const queryCategories = await connection.query("SELECT * FROM categories");
        const categories = queryCategories.rows[0];

        let gameCategory = categories.find(el => el.name === nameCategory);
        if ( !gameCategory) {
            const queryCategorie = await connection.query("INSERT INTO categories (name, category_id) VALUES $1", [nameCategory]); 
            res.send(201)
        } else {
            res.send(409)
        }

        
    } catch {
        res.send(500)
    }

}
