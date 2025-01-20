require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const cors = require('cors');

const app = express();

// Připojení k databázi
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Připojení API routes
app.use('/api', apiRoutes);

// Základní route
app.get('/', (req, res) => {
    res.json({ message: 'Vítejte v EcoHeaven API' });
});

// Ošetření 404
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint nenalezen' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server běží na portu ${port}`);
});
require('dotenv').config();
// ... rest of the code ...