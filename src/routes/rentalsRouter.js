import { Router } from 'express';
import { listRentals, postRentals, returnRentalsById, deleteRentals } from '../controllers/rentalsController.js'
import validRentalsMiddleware   from '../middlewares/rentalsMiddleware.js'

const router = Router();

router.get('/rentals', listRentals)
router.post('/rentals', validRentalsMiddleware, postRentals)
router.post('/rentals/:id/return', validRentalsMiddleware, returnRentalsById)
router.delete('/rentals/:id', deleteRentals)    

export default router