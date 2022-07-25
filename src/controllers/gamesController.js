import connection from "../database.js";


export async function listGames(req, res) {

    const search = req.query.name;
  try {
    const { rows: games } = await connection.query('SELECT * FROM games;');
    const { rows: categories } = await connection.query('SELECT * FROM categories;');
    if (games.length === 0) return res.send([]).status(204);
    const gamesList = games.map(g => {
      const categoryId = g.categoryId;
      const { name: categoryName } = categories.find(c => c.id === categoryId) || { name: "Não especificado" };
      return { ...g, categoryName };
    });
    if (search) {
      const reg = new RegExp('^' + search.toLowerCase());
      const filteredList = gamesList.filter(g => reg.test(g.name.toLowerCase()));
      return res.status(200).send(filteredList);
    }
    res.status(200).send(gamesList);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
//testar
export async function postGames(req, res) { 

    const game = req.body;
  if (game.name === " ") res.sendStatus(400);
   
  try {
    const queryCategories = await connection.query(`SELECT * FROM categories`);
    const category = queryCategories.rows.find(c => c.id === game.categoryId);

    const queryGames = await connection.query(`SELECT * FROM games`);
    const seachedGame = queryGames.rows.find(g => g.name === game.name);

    if (category !== undefined) {
      if (seachedGame === undefined) {
        await connection.query(`
          INSERT INTO games 
            (name, image, "stockTotal", "categoryId", "pricePerDay")
          VALUES 
            ($1, $2, $3, $4, $5)
        `, [game.name, game.image, parseInt(game.stockTotal), game.categoryId, parseInt(game.pricePerDay)]);

        res.sendStatus(201);
      } else {
        res.sendStatus(409);
        return;
      }
    } else {
      res.sendStatus(400);
      return;
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
}