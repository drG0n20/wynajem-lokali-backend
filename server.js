const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ścieżka do pliku JSON (symulacja bazy danych)
const dataFile = path.join(__dirname, 'inquiries.json');

// Inicjalizacja pliku JSON, jeśli nie istnieje
async function initializeDataFile() {
    try {
        await fs.access(dataFile);
    } catch {
        await fs.writeFile(dataFile, JSON.stringify([]));
    }
}

// Endpoint do zapisywania zapytań
app.post('/submit', async (req, res) => {
    try {
        const { name, email, phone, message, property } = req.body;
        const inquiry = {
            id: Date.now(),
            name,
            email,
            phone,
            message,
            property,
            timestamp: new Date().toISOString(),
        };

        // Odczyt istniejących danych
        const data = JSON.parse(await fs.readFile(dataFile, 'utf8'));
        data.push(inquiry);

        // Zapis do pliku
        await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
        res.status(200).json({ message: 'Inquiry saved successfully' });
    } catch (error) {
        console.error('Error saving inquiry:', error);
        res.status(500).json({ message: 'Error saving inquiry' });
    }
});

// Uruchomienie serwera
initializeDataFile().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
