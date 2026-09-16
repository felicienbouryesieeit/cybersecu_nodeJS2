const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const uri = process.env.ATLAS_URI;
let db;
let collection;

// Connexion à MongoDB avant de démarrer le serveur
async function startServer() {
  try {
    const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
    await client.connect();
    db = client.db('maBase');
    collection = db.collection('liste');
    console.log('Connecté à MongoDB Atlas');

    // Routes...
    app.get('/liste', async (req, res) => {
      const liste = await collection.find({}).toArray();
      res.json(liste);
    });

    app.post('/liste', async (req, res) => {
      const { valeur } = req.body;
      if (typeof valeur !== 'string' || valeur.trim() === '') {
        return res.status(400).json({ erreur: 'Le champ "valeur" doit être une string non vide' });
      }
      const result = await collection.insertOne({ valeur, createdAt: new Date() });
      res.status(201).json({ message: 'Ajouté', id: result.insertedId });
    });

    // Autres routes (GET/:id, DELETE/:id, PUT/:id) à adapter avec ObjectId
    // ...

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Erreur de connexion MongoDB:', err);
    process.exit(1);
  }
}

startServer();