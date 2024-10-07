const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Load the constellations data
const constellationsData = fs.readFileSync('./data/constellations.json', 'utf8');
const constellations = JSON.parse(constellationsData);

// Function to filter constellations based on latitude, longitude, and current month
const filterConstellations = (latitude, longitude) => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });

    return constellations.filter(constellation => {
        return constellation.month_visible.includes(currentMonth); // Adjust as necessary
    });
};

// Route for root, so you don't get the "Cannot GET /" error
app.get('/', (req, res) => {
    res.send('Welcome to the Constellation Identifier! Use /constellations with latitude and longitude query parameters.');
});

// Route to handle constellation filtering
app.get('/constellations', (req, res) => {
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    if (!latitude || !longitude) {
        return res.status(400).send('Latitude and longitude are required query parameters.');
    }

    console.log(`Received request for constellations with latitude: ${latitude}, longitude: ${longitude}`);
    
    const filteredConstellations = filterConstellations(latitude, longitude);
    console.log('Filtering constellations completed.');
    
    res.json(filteredConstellations);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
