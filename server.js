
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection 
const uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Connect to MongoDB
connectToDatabase();

// Sample endpoint to handle form submissions with validation
app.post('/api/submitForm', async (req, res) => {
  const { name, email } = req.body;

  //  validation checks
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required fields' });
  }

  //  validation checks for email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const database = client.db('my_db');//db name
    const collection = database.collection('submissions');

    const result = await collection.insertOne({ name, email });
    res.json({ message: 'Form submitted successfully', result });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
