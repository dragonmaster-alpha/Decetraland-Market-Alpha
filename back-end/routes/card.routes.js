import jwt from '../middleware/auth';
import { Router } from "express";
const cardRouter = Router();
const cardController = require('../controllers/card.controller.js');

// Retrieve All data
cardRouter.get('/list', jwt, cardController.findAll);

// Retrieve data with pagination
cardRouter.get('/', cardController.findPagination);

// Find one by ID
cardRouter.get('/:id', cardController.findOne);

// Create
cardRouter.post('/', jwt, cardController.create);

// Update
cardRouter.put('/:id', jwt, cardController.update);

// Delete
cardRouter.delete('/:id', jwt, cardController.delete);

export default cardRouter;
