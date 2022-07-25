import { Router } from 'express'
import { listCustomers, listCustomersById } from '../controllers/customersController.js'
import { postCustomer, updateCustomer } from '../controllers/customersController.js'
import validCustomerMiddleware from '../middlewares/customerMiddleware.js'

const router = Router()

router.get('/customers',  listCustomers)
router.get('/customers/:id',  listCustomersById)
router.post('/customers', validCustomerMiddleware, postCustomer);
router.put('/customers/:id', validCustomerMiddleware, updateCustomer);

export default router;