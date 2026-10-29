# Guide designer

Deux façons de faire évoluer le site : le contenu dans l'admin, tout le reste avec Claude.

## 1. Ajouter ou modifier du contenu → l'admin

Aller sur `https://<le-site>/admin` (site en ligne).

| Je veux…                                                        | Où                                                                                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Ajouter un projet                                               | **Projets** → Créer. Titre, résumé, image de couverture (avec texte alternatif), client, année, rôle, tags, contenu |
| Créer une page (À propos, Services…)                            | **Pages** → Créer. Elle sera visible à `/<slug>`                                                                    |
| Changer le nom du site, l'accroche, l'intro, l'email, les liens | **Réglages du site**                                                                                                |
| Remplacer une image                                             | **Médias**                                                                                                          |
| Changer le témoignage de l'accueil                              | **Accueil** → Témoignage (vide = bloc masqué)                                                                       |
| Mettre une animation sur une expertise                          | **Expertises** → l'expertise → Animation : déposer le fichier Lottie (.json)                                        |

- **Brouillon / Publier** : tant que ce n'est pas publié, rien n'apparaît sur le site. Publier = visible à la prochaine visite (quelques secondes).
- L'admin d'une **preview** (lien Vercel d'une PR) utilise une base de test : ce qu'on y saisit n'arrive jamais sur le site en ligne.

Besoin d'un **nouveau type de contenu** (ex. « Témoignages », un champ « Vidéo » sur les projets, un bloc « Chiffres clés ») ? C'est une fonctionnalité → 2.

## 2. Faire évoluer le site → `/build`

Une nouvelle section, un nouveau design, un bug, une idée : tout passe par `/build` dans Claude Code, ouvert sur ce dépôt. Tu n'as jamais besoin d'aller sur GitHub.

1. **Tu expliques** : Claude pose quelques questions (choix cliquables + réponses libres) et te propose de **joindre un fichier de design** : zip exporté (de Claude ou d'un outil de design), page HTML, captures PNG, PDF, lien Figma. Glisse-le dans la conversation. Pas obligatoire, mais un fichier vaut mille mots.
2. **Il résume** en mots simples ce qu'il va faire et s'y met directement.
3. **Il construit et publie un aperçu** : quelques minutes plus tard, il te donne un **lien d'aperçu** : le vrai site avec la modification, sur une adresse à part (le site en ligne n'est pas touché). Vérifie sur ordinateur **et** sur mobile.
4. **Tu commentes dans la conversation** (« plus d'air entre les cartes », « le titre trop gros sur mobile », une capture…) → il ajuste et te donne le nouveau lien. Autant de tours que nécessaire.
5. **« C'est bon »** → il lance la relecture automatique puis met en ligne. Si une partie technique sensible doit d'abord être vérifiée par un développeur, il te le dit.

Tu peux t'arrêter à tout moment et reprendre avec `/build` → « Reprendre une demande en cours ». Ça marche aussi pour valider une modification préparée par les agents automatiques.

Astuces : décris le ressenti autant que le détail, demande « montre-moi deux variantes », compare avec ta maquette.

À noter : l'admin d'un lien d'aperçu utilise une base de test. Ce que tu y saisis n'arrive jamais sur le site en ligne.

## Préparer son poste (une fois, avec un mainteneur)

Un mainteneur installe Claude Code, git, GitHub CLI, Node et pnpm, connecte ton compte GitHub une fois (`gh auth login`), récupère le projet et l'ouvre dans Claude Code. Ensuite tu n'utilises plus que `/build`.
