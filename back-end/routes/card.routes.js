import jwt from '../middleware/auth';
import { Router } from "express";
const cardRouter = Router();
const cardController = require('../controllers/card.controller.js');

// Retrieve All data
cardRouter.get('/list', cardController.findAll);

// Find all by User ID
cardRouter.get('/sub-list', jwt, cardController.findAllByUserID);

cardRouter.get('/get-received-bid', jwt, cardController.getReceivedBid);

// Update
cardRouter.post('/update-status', jwt, cardController.updateByID);

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
