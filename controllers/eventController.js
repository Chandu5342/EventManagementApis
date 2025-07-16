let events=[]
const Event = require('../models/Event.');
const User = require('../models/User');
const Registration = require('../models/Registration');

exports.createEvent=async (req,res)=>{
     const {title,location,datetime,capacity}=req.body;

     if(!title || !location || !datetime || !capacity)
     {
        return res.status(400).json({error:'all fields are req'});
     }

     if(!(capacity>=1 && capacity<=1000))
     {
        return res.status(400).json({error:"capicty must be in between 1 & 10000"});
     }

     try {
    const event = await Event.create({ title, location, datetime, capacity });
    return res.status(201).json({ message: ' created', event });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'error' });
  }

};


exports.getEventDetails=async (req,res)=>{
   const eventid=parseInt(req.params.id,10);
    try {
    const event = await Event.findByPk(eventid); 

    if (!event) {
      return res.status(404).json({ error: 'Event not there' });
    }

    return res.status(200).json(event);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal  error' });
  }
};




exports.Uregistration = async (req, res) => {
  const { userid, username, eventid } = req.body;

  try {
    //  Check if event exists
    const event = await Event.findByPk(eventid);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    //  Check if event is expired
    const now = new Date();
    const eventTime = new Date(event.datetime);
    if (eventTime < now) {
      return res.status(400).json({ error: 'Event  expired' });
    }

    //  Create user if not exists
    let user = await User.findByPk(userid);
    if (!user) {
      user = await User.create({ id: userid, name: username });
    }

    //  Check for duplicate registration
    const alreadyRegistered = await Registration.findOne({
      where: { UserId: userid, EventId: eventid }
    });

    if (alreadyRegistered) {
      return res.status(400).json({ error: 'User already registered for this event' });
    }

    //  Check capacity
    const registrationCount = await Registration.count({
      where: { EventId: eventid }
    });

    if (registrationCount >= event.capacity) {
      return res.status(400).json({ error: 'Event is full' });
    }

    //  Create registration
    await Registration.create({ UserId: userid, EventId: eventid });

    return res.status(200).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};




exports.UDelete=async (req,res)=>{
    const { userid, eventid } = req.body;

  try {
    // does the registration exist
    const registration = await Registration.findOne({
      where: { UserId: userid, EventId: eventid }
    });

    if (!registration) {
      return res
        .status(400)
        .json({ error: 'User is not registered  this event' });
    }

    // delete the row
    await registration.destroy();
    return res.json({ message: 'Registration cancelled ' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal  error' });
  }

};


exports.getUpcomingEvents = async (req, res) => {
  const now = new Date();

  try {
    const events = await Event.findAll({
      where: {
        datetime: {
          [require('sequelize').Op.gt]: now
        }
      },
      order: [
        ['datetime', 'ASC'],
        ['location', 'ASC']
      ]
    });

    return res.status(200).json(events);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


const { Op } = require('sequelize');

exports.getEventStats = async (req, res) => {
  const eventId = parseInt(req.params.id, 10);

  try {
    //   Get the event first
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    //  Count current registrations
    const totalRegistered = await Registration.count({
      where: { EventId: eventId }
    });

    const remaining     = event.capacity - totalRegistered;
    const percentFilled = ((totalRegistered / event.capacity) * 100).toFixed(2);

    return res.json({
      eventId: event.id,
      totalRegistered,
      remaining,
      percentFilled: `${percentFilled}%`
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
