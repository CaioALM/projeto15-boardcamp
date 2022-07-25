import connection from "../database.js";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime.js'


export async function listRentals (req, res) {

    const customerId = req.query.customerId;
    const gameId = req.query.gameId;
    async function createRentalObjectsLsts(rentalsList){
      const arr = [];
      for (let i = 0; i < rentalsList.length; i++) {
        const { rows: customer } = await connection.query('SELECT id,name FROM customers WHERE id = $1', [rentalsList[i].customerId]);
        const { rows: game } = await connection.query('SELECT games.id,games.name,games."categoryId",categories.name FROM games JOIN categories ON games."categoryId"=categories.id WHERE games.id = $1', [rentalsList[i].gameId]);
        arr.push({
          ...rentalsList[i],
          customer: customer[0],
          game: game[0]
        });
      }
      return arr;
    }
    try {
      
      const { rows: rentals } = await connection.query('SELECT * FROM rentals WHERE "returnDate" IS NULL');
      if (rentals.length === 0) return res.send([]).status(204);
      
      if (gameId) {
        const { rows: filteredList } = await connection.query(
            'SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL', [gameId]);
        const result = await createRentalObjectsLsts(filteredList);
        return res.status(200).send(result);
      }
      if (customerId) {
        const { rows: filteredList } = await connection.query(
            'SELECT * FROM rentals WHERE "customerId"=$1 AND "returnDate" IS NULL', [customerId]);
        const result = await createRentalObjectsLsts(filteredList);
        
        return res.status(200).send(result);
      }
      const result = await createRentalObjectsLsts(rentals);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(error.message);
    }
}

export async function postRentals (req, res) {

    const { customerId, gameId, daysRented } = req.body;
  if (daysRented <= 0) return res.sendStatus(400);
  try {
    const { rows: customer } = await connection.query('SELECT * FROM customers WHERE id=$1', [customerId]);
    const { rows: game } = await connection.query('SELECT * FROM games WHERE id=$1', [gameId]);
    const { rows: gameRentals } = await connection.query(
        'SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL', [gameId]);

    if (!customer.length || !game.length || game[0].stockTotal < gameRentals.length) return res.sendStatus(400);

    const originalPrice = game[0].pricePerDay * daysRented;
    const rentDate = dayjs().format('YYYY-MM-DD');

    await connection.query(`
      INSERT INTO rentals
      ("customerId","gameId","daysRented","returnDate","originalPrice","delayFee","rentDate") 
      VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [customerId, gameId, daysRented, null, originalPrice, null, rentDate]
    )
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function returnRentalsById (req, res) {
    const id = req.params.id;

  try {
    const { rows: rent } = await connection.query('SELECT * FROM rentals WHERE id =$1', [id]);
    if (rent.length === 0 || rent[0].returnDate !== null) return res.sendStatus(400);
    const { rentDate, daysRented, gameId } = rent[0];
    const { rows: pricePerDay } = await connection.query('SELECT "pricePerDay" FROM games WHERE id = $1', [gameId]);
    const returnDate = dayjs().format('YYYY-MM-DD');

    dayjs.extend(relativeTime);
    let daysPassed = dayjs(returnDate).from(rentDate, true);
    if (daysPassed === 'a day') daysPassed = 1; else daysPassed = daysPassed.match(/[0-9]/);
    let delayFee = (daysPassed - daysRented) * pricePerDay[0].pricePerDay;
    if (delayFee < 0) delayFee = null;
    await connection.query(`
    UPDATE rentals 
    SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`, [returnDate, delayFee, id]);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }

}


export async function deleteRentals (req, res) {
    
const id = req.params.id;

  try {
    const { rows: rentals } = await connection.query('SELECT * FROM rentals WHERE id =$1', [id]);
    if (rentals.length === 0) return res.sendStatus(404);
    if (rentals[0].returnDate !== null) return res.sendStatus(400);
    await connection.query('DELETE FROM rentals WHERE id =$1', [id]);
    res.sendStatus(200);
  } catch (error) { res.status(500).send(error.message) }
}