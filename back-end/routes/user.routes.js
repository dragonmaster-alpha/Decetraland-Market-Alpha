import jwt from '../middleware/auth';
import { Router } from "express";
const userRouter = Router();
const userController = require('../controllers/user.controller.js');

// Retrieve All data
userRouter.get('/list', jwt, userController.findAll);

// Retrieve data with pagination
userRouter.get('/', userController.findPagination);

// Find one by ID
userRouter.get('/:id', userController.findOne);

// Create
userRouter.post('/', jwt, userController.create);

// Update
userRouter.put('/:id', jwt, userController.update);

// Delete
userRouter.delete('/:id', jwt, userController.delete);

//Update mana
userRouter.post('/update-mana', jwt, userController.updateMana);

export default userRouter;
