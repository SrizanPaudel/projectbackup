const express = require('express');
const cors = require('cors');
const connectDb = require('./config/dbConnection');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

connectDb();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(PORT , () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});