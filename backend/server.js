const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

app.get("/", (req, res) => {
    res.send("Ideascoop Backend Running ✔️");
});

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running → http://localhost:${PORT}`));
