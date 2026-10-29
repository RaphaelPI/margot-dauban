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

Dans Claude Code, taper `/request`. Claude pose des questions (choix cliquables + réponses libres), montre le ticket, puis le crée sur GitHub. Ensuite, des agents automatiques :

1. vérifient le ticket et posent des questions en commentaire si besoin → **répondre en modifiant le ticket** (pas en commentaire) ;
2. si demandé, proposent un plan → cocher **Approve plan and start dev** pour lancer ;
3. développent et ouvrent une PR avec un **lien de preview Vercel** → vérifier le rendu.

Sans Claude Code : GitHub → Issues → New issue → choisir un formulaire (« Avec mes mots » si tu ne sais pas lequel).

## 3. Construire soi-même avec Claude → `/build`

Pour itérer en direct sur le design. Dans Claude Code, ouvert sur ce dépôt, taper `/build` :

1. Claude demande quel ticket (ou en crée un avec toi) ;
2. propose un plan en mots simples → tu valides ;
3. code, lance le site en local et te donne l'adresse (`http://localhost:3000`) → tu regardes, tu commentes, il ajuste ;
4. quand tu es satisfaite ou satisfait, il vérifie tout, ouvre la PR et te donne le lien de preview.

Tu n'as pas besoin de connaître git. Claude ne pousse jamais directement sur le site en ligne : tout passe par une PR relue.

Astuces : envoie une capture ou un lien Figma, décris le ressenti (« plus aéré », « hiérarchie plus forte sur le titre »), demande « montre-moi deux variantes ».

## Mise en ligne

Une PR fusionnée dans `main` = site en ligne mis à jour automatiquement. Les petites modifications sûres (texte, style) peuvent fusionner seules ; le reste attend une relecture humaine.

## Préparer son poste (une fois)

Installer Claude Code, Node 24, pnpm et `gh` (GitHub CLI), puis `gh auth login`, cloner le dépôt, `pnpm install`, `cp .env.example .env` et demander les valeurs à un mainteneur. `/build` vérifie le reste.
