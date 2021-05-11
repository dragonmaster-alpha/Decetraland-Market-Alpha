import jwt from '../middleware/auth';
import { Router } from "express";
const bidRouter = Router();
const bidController = require('../controllers/bid.controller.js');

// Retrieve All data
bidRouter.get('/list', jwt, bidController.findAll);

// Retrieve data with pagination
bidRouter.get('/', bidController.findPagination);

// Find one by ID
bidRouter.get('/:id', bidController.findOne);

// Create
bidRouter.post('/', jwt, bidController.create);

// Update
bidRouter.put('/:id', jwt, bidController.update);

// Delete
bidRouter.delete('/:id', jwt, bidController.delete);

export default bidRouter;
