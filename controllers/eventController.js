let events=[]
const Event = require('../models/Event.');

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

let Users=[]
let registerUsers=[];

exports.Uregistration = (req, res) => {
  const { userid, username, eventid } = req.body;

  const event = events.find(e => e.id === eventid);
  if (!event) {
    return res.status(400).json({ error: 'Event does not exist' });
  }

  const now = new Date();
  const eventTime = new Date(event.datetime);
  if (eventTime < now) {
    return res.status(400).json({ error: 'Event has already expired' });
  }

  // Check if the user is already registered
  const isDup = event.registerUsers.includes(userid);
  if (isDup) {
    return res.status(400).json({ error: 'User already registered for this event' });
  }

  event.registerUsers.push(userid);

  registerUsers.push({ userid, eventid });

  if (!Users.find(u => u.id === userid)) {
    Users.push({ id: userid, name: username });
  }

  return res.status(200).json({ message: 'User registered successfully' });
};



exports.UDelete=(req,res)=>{
     const {userid,eventid}=req.body;
     const event=events.find(e=>e.id===eventid);
     if(!event){return res.status(400).json({error:'no event exist'})};
     const regindex=registerUsers.findIndex(r=>r.userid===userid && r.eventid===eventid);
     if(regindex==-1)
    {
        return res.status(400).json({error:'user is not register for this event'});
    }

    registerUsers.splice(regindex,1);
    event.registerUsers=event.registerUsers.filter(id=>id!=userid);
    return res.status(200).json({message:'delted succussfully'});

};


exports.getUpcomingEvents = (req, res) => {
  const now = new Date();

  // Filter only future events
  const upcoming = events.filter(e => new Date(e.datetime) > now);

  // Sort: first by date, then by location
  upcoming.sort((a, b) => {
    const dateA = new Date(a.datetime);
    const dateB = new Date(b.datetime);

    if (dateA.getTime() !== dateB.getTime()) {
      return dateA - dateB;
    } else {
      return a.location.localeCompare(b.location);
    }
  });

  return res.json(upcoming);
};


exports.getEventStats = (req, res) => {
  const eventId = parseInt(req.params.id);
  const event = events.find(e => e.id === eventId);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const totalRegistered = event.registeredUsers.length;
  const remaining = event.capacity - totalRegistered;
  const percentFilled = ((totalRegistered / event.capacity) * 100).toFixed(2);

  return res.json({
    eventId: event.id,
    totalRegistered,
    remaining,
    percentFilled: `${percentFilled}%`
  });
};
