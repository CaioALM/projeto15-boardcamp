import { Router } from 'express';
import { listGames, postGames } from '../controllers/gamesController.js'
import validGameMiddleware   from '../middlewares/gameMiddleware.js'

const router = Router();

router.get('/games', listGames)
router.post('/games', validGameMiddleware, postGames)

export default router