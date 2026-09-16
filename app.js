const fs = require('fs');
const path = require('path');

const FICHIER = path.join(__dirname, 'liste.json');

// Charger la liste depuis le fichier (ou [] si inexistant)
function chargerListe() {
  if (!fs.existsSync(FICHIER)) return [];
  const contenu = fs.readFileSync(FICHIER, 'utf-8');
  return JSON.parse(contenu || '[]');
}

// Sauvegarder la liste dans le fichier
function sauvegarderListe(liste) {
  fs.writeFileSync(FICHIER, JSON.stringify(liste, null, 2));
}

// Ajouter un élément
function ajouter(element) {
  const liste = chargerListe();
  liste.push(element);
  sauvegarderListe(liste);
  console.log(`✅ Ajouté : "${element}"`);
}

// Afficher la liste
function afficher() {
  const liste = chargerListe();
  if (liste.length === 0) {
    console.log('📭 La liste est vide.');
    return;
  }
  console.log('📋 Contenu de la liste :');
  liste.forEach((item, i) => console.log(`  ${i + 1}. ${item}`));
}

// Supprimer un élément par index
function supprimer(index) {
  const liste = chargerListe();
  if (index < 0 || index >= liste.length) {
    console.log('❌ Index invalide.');
    return;
  }
  const [supprime] = liste.splice(index, 1);
  sauvegarderListe(liste);
  console.log(`🗑️  Supprimé : "${supprime}"`);
}

// --- Interface en ligne de commande ---
const [,, commande, ...args] = process.argv;

switch (commande) {
  case 'ajouter':
    if (!args.length) console.log('Usage : node liste.js ajouter "mon texte"');
    else ajouter(args.join(' '));
    break;
  case 'afficher':
    afficher();
    break;
  case 'supprimer':
    supprimer(parseInt(args[0], 10));
    break;
  default:
    console.log(`
Usage :
  node liste.js ajouter "texte"   → Ajoute un élément
  node liste.js afficher          → Affiche la liste
  node liste.js supprimer <index> → Supprime par index (0 = premier)
    `);
}