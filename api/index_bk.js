const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/e9800998ecf8427e/demo', async (req, res) => {
    try {
        const requestData = req.body;

        // Call another API
        const response = await axios.post('', requestData, {
            headers: {
                'Content-Type': '',
                'Authorization': ''
            }
        });

        res.status(response.status).send(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.get("/", (req, res) => res.send("Congratulation 🎉🎉! Our Express server is Running on Vercel"));


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;