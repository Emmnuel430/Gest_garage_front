# Frontend - Gestion de Garage

Interface utilisateur React 19 pour la gestion du garage automobile.

## Prerequis

- Node.js 18+ ou 20+
- pnpm (recommande) ou npm

## Installation

```bash
pnpm install
cp .env.example .env # ou configurer directement le fichier .env
```

## Variables d'Environnement

Les variables concernant Laravel Reverb s'utilisent desormais directement sans obligation de prefixe `REACT_APP_` (avec fallback transparent pour retrocompatibilite) :

```env
# Reverb WebSocket
REVERB_APP_KEY=...
REVERB_HOST=127.0.0.1
REVERB_PORT=8080
REVERB_SCHEME=http

# Retrocompatibilite Create React App (si necessaire)
REACT_APP_REVERB_APP_KEY=...
REACT_APP_REVERB_HOST=127.0.0.1
REACT_APP_REVERB_PORT=8080
REACT_APP_REVERB_SCHEME=http

# Backend API
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

## Fonctionnalites Cles et Modifications Recentes

### 1. Outils Speciaux et Gestion des Prets
- Formulaire d'ajout / modification d'outil (`OutilForm.jsx`, `InventaireOutils.js`) :
  - Interrupteur dedie : **Outil special (facture a l'heure)**.
  - Champ de saisie : **Tarif horaire (FCFA/h)** obligatoire des que l'option speciale est activee.
- Fiche de pret (`PretOutilForm.jsx`) :
  - Recherche et selection avancee via **React Select** pour le mecanicien demandeur et pour le vehicule concerne.
  - Signalement instantane a la selection d'un outil special avec rappel du cout horaire applique selon le chrono du vehicule.
- Tableau de suivi des prets (`PretsOutilsTable.jsx`) :
  - Refonte UI/UX complete anti-debordement : gestion des libelles longs, badges compacts, indicateurs d'outils speciaux et statuts partages.
- Modal de gestion de pret (`EditPretModal.jsx`) :
  - Modification de quantite pretee.
  - **Affectation / Partage multi-vehicules :** Possibilite d'affecter l'outil deja detenu par le mecanicien a un autre vehicule en cours de reparation, afin d'appliquer la facturation sans sortir d'outil physique supplementaire du magasin.

### 2. Notifications Push, Sidebar Mobile et Accessibilite Visuelle
- `NotificationBell.jsx` : 
  - **Sidebar Offcanvas Responsive :** Remplacement de l'ancien dropdown par un volet latéral fluide (droite), occupant 80% de la largeur d'écran sur smartphone (min 290px, max 420px sur PC), avec backdrop et fermeture intuitive.
  - **Alignement et Ergonomie :** En-tête sur 2 rangées aérées évitant tout chevauchement de boutons ou de textes sur petits écrans :
    - Rangée 1 : Cloche, titre "Notifications", badge compteur et bouton de fermeture `btn-close`.
    - Rangée 2 : Onglets de filtrage par pastilles ("Toutes" / "Non lues") et action globale "Tout lire".
  - **Contraste Élevé Dark & Light (WCAG) :** Utilisation des classes sémantiques Bootstrap 5.3 (`bg-*-subtle text-*-emphasis border-*-subtle`) garantissant un contraste lisible quel que soit le thème actif, évitant les textes délavés en mode sombre ou jaunâtres en mode clair.
  - **Toasts Globaux (`ToastGlobal.js`, `ToastConfig.js`) :** Boutons de fermeture à contraste garanti (`btn-close-white` sur fonds sombres, sombre sur fond jaune), contrainte de largeur maximale responsive et overlay non bloquant (`pointer-events: none`).

### 3. Suppression du Prix Fixe d'Entree
- Le champ "Prix fixe d'entree" (prise en charge) a ete retire de la page des parametres generaux (`Parametres.js`).
- Seuls les tarifs reglementaires horaires et journaliers supplementaires sont desormais modifiables et transmis a l'API.

### 4. Connexion WebSocket Reverb Unifiee
- L'initialisation d'Echo (`src/utils/echo.js`) prend en charge en priorite les variables `REVERB_APP_KEY`, `REVERB_HOST`, `REVERB_PORT`, `REVERB_SCHEME`.

## Commandes Disponibles

### Lancement en developpement
```bash
pnpm start
```

### Verification et Compilation de production
```bash
pnpm build
```

### Batterie de Tests Automatises
Des tests unitaires et d'integration valident les fonctionnalites critiques :
- `EchoConfig.test.js` : Prise en charge des variables d'environnement `REVERB_*` sans prefixe et fallback.
- `Parametres.test.js` : Verification de l'absence du champ prix fixe d'entree.
- `OutilForm.test.js` : Comportement dynamique du formulaire des outils speciaux (activation tarif horaire, validations).
- `OutilsTable.test.js` : Affichage conforme des badges d'outils speciaux et des tarifs horaires.
- `PretsOutilsTable.test.js` : Rendu du tableau des prets, outils speciaux au chrono et prets partages.
- `EditPretModal.test.js` : Modification de pret et affectation multi-vehicules.
- `NotificationBell.test.js` : Sidebar Offcanvas, onglets de filtrage et contrastes semantiques Bootstrap 5.3.

```bash
# Executer l'ensemble de la batterie de tests
node ./node_modules/react-scripts/bin/react-scripts.js test --watchAll=false
```

