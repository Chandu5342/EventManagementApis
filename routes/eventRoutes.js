const express = require('express');
const router=express.Router();
const eventController=require('../controllers/eventController');




router.post('/events',eventController.createEvent);
router.get('/events/:id',eventController.getEventDetails);

//user registration for events 

router.post('/uregister',eventController.Uregistration);
router.delete('/Udelete',eventController.UDelete);

router.get('/Upcomingevents',eventController.getUpcomingEvents);
router.get('/eventstats/:id',eventController.getEventStats);

module.exports=router;