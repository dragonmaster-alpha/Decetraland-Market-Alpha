import { Router } from "express";
const trackRouter = Router();
const trackController = require('../controllers/track.controller.js');

// Retrieve All data
trackRouter.get('/list', trackController.findAll);


// Set Data by team ID
trackRouter.post('/set', trackController.addTrack);

//Retrieve collection list
trackRouter.get('/collections', trackController.getCollections);

//Retrieve time history list
trackRouter.get('/timehistory', trackController.getTimeHistory);

export default trackRouter
