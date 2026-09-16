const express = require('express');
const app = express();
const PORT = 3000;

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// Notre "base de données" en mémoire
let liste = ['premier élément', 'deuxième élément'];

// GET /liste -> récupérer toute la liste
app.get('/liste', (req, res) => {
  res.json(liste);
});

// GET /liste/:index -> récupérer un élément précis
app.get('/liste/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (isNaN(index) || index < 0 || index >= liste.length) {
    return res.status(404).json({ erreur: 'Index invalide' });
  }
  res.json({ index, valeur: liste[index] });
});

// POST /liste -> ajouter un élément
// Body attendu : { "valeur": "mon texte" }
app.post('/liste', (req, res) => {
  const { valeur } = req.body;
  if (typeof valeur !== 'string' || valeur.trim() === '') {
    return res.status(400).json({ erreur: 'Le champ "valeur" doit être une string non vide' });
  }
  liste.push(valeur);
  res.status(201).json({ message: 'Ajouté', liste });
});

// DELETE /liste/:index -> supprimer un élément
app.delete('/liste/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (isNaN(index) || index < 0 || index >= liste.length) {
    return res.status(404).json({ erreur: 'Index invalide' });
  }
  const [supprime] = liste.splice(index, 1);
  res.json({ message: 'Supprimé', valeur: supprime, liste });
});

// PUT /liste/:index -> modifier un élément
// Body attendu : { "valeur": "nouveau texte" }
app.put('/liste/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  const { valeur } = req.body;
  if (isNaN(index) || index < 0 || index >= liste.length) {
    return res.status(404).json({ erreur: 'Index invalide' });
  }
  if (typeof valeur !== 'string' || valeur.trim() === '') {
    return res.status(400).json({ erreur: 'Le champ "valeur" doit être une string non vide' });
  }
  liste[index] = valeur;
  res.json({ message: 'Modifié', liste });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});