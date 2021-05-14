import jwt from '../middleware/auth';
import { Router } from "express";
const bidRouter = Router();
const bidController = require('../controllers/bid.controller.js');

// Retrieve All data
bidRouter.get('/list', jwt, bidController.findAll);

// Retrieve data with pagination
bidRouter.get('/', bidController.findPagination);

// Retrieve placed bid data
bidRouter.get('/get-placed-bid', jwt, bidController.getPlacedBid);

bidRouter.get('/get-received-bid', jwt, bidController.getReceivedBid);

// Retrieve received bid data

// Find one by ID
bidRouter.get('/:id', bidController.findOne);

// Create
bidRouter.post('/', jwt, bidController.create);

// Update
bidRouter.put('/:id', jwt, bidController.update);

// Delete
bidRouter.delete('/:id', jwt, bidController.delete);

// Get matched bid
bidRouter.post('/get-bid', jwt, bidController.findMatchBid);

// Update or Create
bidRouter.post('/update', jwt, bidController.updateOrCreate);

export default bidRouter;
