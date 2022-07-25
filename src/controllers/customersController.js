import connection from "../database.js";  

export async function listCustomers(req, res) {

    const search = req.query.cpf;
  try {
    const { rows: customers } = await connection.query('SELECT * FROM customers;');
    if (customers.length === 0) return res.send([]).status(204);
    if (search) {
      const re = new RegExp('^' + search);
      const filteredList = customers.filter(c => re.test(c.cpf));
      return res.status(200).send(filteredList);
    }
    res.status(200).send(customers);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function listCustomersById (req, res) { 

    const { id }= req.params;
    try {
      const { rows: custumer } = await connection.query(`SELECT * FROM customers WHERE id = $1;`, [id]);
      if (custumer.length === 0) return res.sendStatus(404);
  
      res.status(200).send(custumer[0]);
    } catch (error) {
      res.status(500).send(error.message);
    }
}

export async function postCustomer(req, res) {  
    const body = req.body;
  
  const { cpf, phone, name, birthday } = body;

    try {
        const { rows: customers } = await connection.query('SELECT * FROM customers WHERE cpf=$1;', [cpf]);
        if (customers.length) return res.sendStatus(409);
        await connection.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ( $1, $2, $3, $4);',
         [name, phone, cpf, birthday]);
        res.sendStatus(201);
      } catch (error) {
        res.status(500).send(error.message);
      }

}

export async function updateCustomer(req, res) {  

    const id = req.params.id;
    const body = req.body;
  
  const { cpf, phone, name, birthday } = body;
  try {
    const { rows: customers } = await connection.query('SELECT * FROM customers WHERE cpf=$1 AND id!=$2;', [cpf, id]);
    if (customers.length) return res.sendStatus(409);
    await connection.query('UPDATE customers SET cpf=$2, phone=$3, name=$4, birthday=$5 WHERE id=$1;', 
    [id, cpf, phone, name, birthday]);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }

}

