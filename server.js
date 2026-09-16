require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'maBase';

let collection;

async function connectDB() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  collection = db.collection('strings');
  console.log('✅ Connecté à MongoDB');
}

// GET /strings -> renvoie toute la liste
app.get('/strings', async (req, res) => {
  try {
    const docs = await collection.find({}).toArray();
    res.json(docs.map(d => d.value));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /strings { "value": "texte" } -> ajoute un string
app.post('/strings', async (req, res) => {
  try {
    const { value } = req.body;
    if (typeof value !== 'string') {
      return res.status(400).json({ error: 'value doit être un string' });
    }
    await collection.insertOne({ value });
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /strings/:value -> supprime un string
app.delete('/strings/:value', async (req, res) => {
  try {
    await collection.deleteOne({ value: req.params.value });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Démarrage : on attend la connexion DB avant d'écouter
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Serveur sur le port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB :', err);
    process.exit(1);
  });