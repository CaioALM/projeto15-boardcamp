import { Router } from 'expresss'
import { listCategories, postCategories } from '../controllers/categoriesController.js'

const router = Router()

router.get('/categories', listCategories)
router.post('/categories', postCategories)

export default router;