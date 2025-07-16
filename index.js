
require('dotenv').config();          

const express = require('express');
const app = express();


const User = require('./models/User');
const Event = require('./models/Event.');
const Registration = require('./models/Registration');

const eventRoutes = require('./routes/eventRoutes');
const sequelize   = require('./config/db');

app.use(express.json());
app.use('/api', eventRoutes);

app.get('/', (req, res) => res.send('Server is running '));

const PORT = process.env.PORT || 5000;


(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });   // auto‑create tables
    console.log('Connected & synced with Supabase');

    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error(' DB error:', err);
  }
})();
