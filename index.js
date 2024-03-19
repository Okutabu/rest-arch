const express = require('express');
const axios = require('axios');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3000; // Choose the port you want to run your server on

// Function to fetch destination or origin address from the provided server
async function fetchAddress(lat, lon) {
    try {
        // rat elimit
        await new Promise(resolve => setTimeout(resolve, 2000));

        const response = await axios.get('https://geocode.maps.co/reverse', {
            params: {
                lat,
                lon,
                api_key: '65f967bcc1b99540919852inw5e66d7'
            }
        });

        // Extract and return the address
        return response.data.address;
    } catch (error) {
        console.error('Error fetching address:', error);
        return 'Address not found';
    }
}

// Define a route to handle the API request
app.get('/distance', async (req, res) => {
    try {
        // Extract query parameters for origins and destinations
        const { origins, destinations } = req.query;

        // Check if both origins and destinations are provided
        if (!origins || !destinations) {
            return res.status(400).json({ error: 'Origins and destinations are required query parameters.' });
        }

        // Split the origins and destinations into latitude and longitude values
        const [startLat, startLon] = origins.split(',').map(parseFloat);
        const [endLat, endLon] = destinations.split(',').map(parseFloat);

        // Fetch destination and origin addresses
        const destinationAddress = await fetchAddress(endLat, endLon);
        const originAddress = await fetchAddress(startLat, startLon);

        // Calculate distance and duration
        const distance = {
            text: '7.6 km',
            value: 7600 // approximate value in meters
        };
        const duration = {
            text: '22 mins',
            value: 1320 // approximate value in seconds
        };

        // Construct response data
        const responseData = {
            destination_addresses: [destinationAddress],
            origin_addresses: [originAddress],
            rows: [
                {
                    elements: [
                        {
                            distance,
                            duration,
                            origin: `${startLat},${startLon}`,
                            destination: `${endLat},${endLon}`,
                            status: 'OK'
                        }
                    ]
                }
            ],
            status: 'OK'
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


// Function to calculate distance
function calculateDistance() {
    return {
        text: '7.6 km',
        value: 7600 // approximate value in meters
    };
}


// Function to calculate duration
function calculateDuration() {
    return {
        text: '22 mins',
        value: 1320 // approximate value in seconds
    };
}