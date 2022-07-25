import express from 'express';
import cors from 'cors';  
import dotenv from 'dotenv'; 
import chalk from 'chalk';  
import categoriesRouter from './routes/categoriesRouter.js'
import gamesRouter from './routes/gamesRouter.js'; 
import customerRouter from './routes/customerRouter.js';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(categoriesRouter)
app.use(gamesRouter)
app.use(customerRouter)

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {    
    console.log(chalk.bold.green(`Server listening on port ${PORT}`))})