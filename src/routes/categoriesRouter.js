import { Router } from 'express'
import { listCategories, postCategories } from '../controllers/categoriesController.js'
import validPostCategory from '../middlewares/categoryMiddleware.js'

const router = Router()

router.get('/categories', listCategories)
router.post('/categories', validPostCategory, postCategories)

export default router;