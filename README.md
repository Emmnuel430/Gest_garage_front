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

### 1. Outils Speciaux Factures a l'Heure
- Formulaire d'ajout / modification d'outil (`OutilForm.jsx`, `InventaireOutils.js`) :
  - Interrupteur dedie : **Outil special (facture a l'heure)**.
  - Champ de saisie : **Tarif horaire (FCFA/h)** obligatoire des que l'option speciale est activee.
- Tableaux de visualisation (`OutilsTable.jsx`, `PretsOutilsTable.jsx`) :
  - Badge visuel distinctif indiquant le tarif horaire pour chaque outil special.
- Fiche de pret (`PretOutilForm.jsx`) :
  - Signalement instantane a la selection d'un outil special avec rappel du cout horaire applique selon le chrono du vehicule.

### 2. Suppression du Prix Fixe d'Entree
- Le champ "Prix fixe d'entree" (prise en charge) a ete retire de la page des parametres generaux (`Parametres.js`).
- Seuls les tarifs reglementaires horaires et journaliers supplementaires sont desormais modifiables et transmis a l'API.

### 3. Connexion WebSocket Reverb Unifiee
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

```bash
# Executer l'ensemble de la batterie de tests
pnpm test --watchAll=false
# ou
node ./node_modules/react-scripts/scripts/test.js --watchAll=false
```
