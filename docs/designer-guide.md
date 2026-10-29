# Guide designer

Trois façons de faire évoluer le site, de la plus simple à la plus technique.

## 1. Ajouter ou modifier du contenu → l'admin

Aller sur `https://<le-site>/admin` (site en ligne).

| Je veux…                                                        | Où                                                                                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Ajouter un projet                                               | **Projets** → Créer. Titre, résumé, image de couverture (avec texte alternatif), client, année, rôle, tags, contenu |
| Créer une page (À propos, Services…)                            | **Pages** → Créer. Elle sera visible à `/<slug>`                                                                    |
| Changer le nom du site, l'accroche, l'intro, l'email, les liens | **Réglages du site**                                                                                                |
| Remplacer une image                                             | **Médias**                                                                                                          |

- **Brouillon / Publier** : tant que ce n'est pas publié, rien n'apparaît sur le site. Publier = visible à la prochaine visite (quelques secondes).
- L'admin d'une **preview** (lien Vercel d'une PR) utilise une base de test : ce qu'on y saisit n'arrive jamais sur le site en ligne.

Besoin d'un **nouveau type de contenu** (ex. « Témoignages », un champ « Vidéo » sur les projets, un bloc « Chiffres clés ») ? C'est une fonctionnalité → 2 ou 3.

## 2. Demander une fonctionnalité ou signaler un bug → `/request`

Dans Claude Code, taper `/request`. Claude pose des questions (choix cliquables + réponses libres) et te propose de **joindre un fichier de design** : zip exporté (de Claude ou d'un outil de design), page HTML, captures PNG, PDF. Glisse-le dans la conversation. Ce n'est pas obligatoire, mais un fichier vaut mille mots : Claude le lit et pose moins de questions. Il montre ensuite le ticket et le crée sur GitHub, avec ton fichier rangé à côté. Puis des agents automatiques :

1. vérifient le ticket et posent des questions en commentaire si besoin → **répondre en modifiant le ticket** (pas en commentaire) ;
2. si demandé, proposent un plan → cocher **Approve plan and start dev** pour lancer ;
3. développent et ouvrent une PR → tu reçois un **lien d'aperçu** (sur le ticket et la PR).

Sans Claude Code : GitHub → Issues → New issue → choisir un formulaire (« Avec mes mots » si tu ne sais pas lequel). On peut y glisser des captures ou un lien Figma.

## 3. Construire soi-même avec Claude → `/build`

Pour itérer en direct sur le design. Dans Claude Code, ouvert sur ce dépôt, taper `/build` :

1. Claude demande quel ticket (ou en crée un avec toi) et ton fichier de design s'il y en a un ;
2. te dit ce qu'il voit dans le fichier, propose un plan en mots simples → tu valides ;
3. code, lance le site en local et te donne l'adresse (`http://localhost:3000`) → tu regardes, tu commentes, il ajuste ;
4. quand c'est bon, il ouvre la PR et te donne le **lien d'aperçu**.

Tu n'as pas besoin de connaître git. Rien ne part en ligne sans ta validation ou celle d'un mainteneur.

Astuces : envoie une capture ou un lien Figma, décris le ressenti (« plus aéré », « hiérarchie plus forte sur le titre »), demande « montre-moi deux variantes ».

## 4. Valider et mettre en ligne

Chaque fonctionnalité a sa PR et son **lien d'aperçu** : le vrai site avec la modification, sur une adresse à part. Le lien est mis à jour à chaque nouvelle version.

1. Ouvre le lien, vérifie sur ordinateur **et** sur mobile (il faut peut-être être connectée ou connecté à Vercel).
2. Si c'est bon : coche **Valider et fusionner** dans le commentaire « Aperçu » de la PR. Ou dis-le à Claude dans `/build` (→ « Valider une PR »), il coche pour toi.
3. La PR fusionne dès que les vérifications automatiques sont vertes, et le site en ligne est à jour quelques minutes après.

Si la case se décoche toute seule, lis le message du robot : soit une nouvelle version arrive (attends le nouveau lien), soit la modification touche une partie technique sensible et un mainteneur doit d'abord l'approuver. Les toutes petites modifications sûres (un texte, une couleur) peuvent aussi fusionner seules.

## Préparer son poste (une fois)

Installer Claude Code, Node 24, pnpm et `gh` (GitHub CLI), puis `gh auth login`, cloner le dépôt, `pnpm install`, `cp .env.example .env` et demander les valeurs à un mainteneur. `/build` vérifie le reste.
