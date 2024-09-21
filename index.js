require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const calendarRoutes = require('./models/Calendar');
const app = express();

// Connect to the database
connectDB().catch(err => {
    console.error('Failed to connect to the database:', err);
    process.exit(1);''
});

app.use(express.json({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/calendar', calendarRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    .on('error', err => {
        console.error('Failed to start the server:', err);
        process.exit(1);
    });