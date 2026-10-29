# Intake questions

Single source of the questions asked to the designer. Used by the **intake** agent (`/request`), the **designer** agent (`/build`, when no issue exists), and the triage agent (checks the answers are in the issue). **Edit questions here only.** Ask them in French; options below are the French labels to show.

## Rules for whoever asks

- Ask in the order of the tables. Skip what the designer already answered.
- **Must** = can't be implemented without it. **If relevant** = only when the need touches that topic.
- **Answer** column:
  - `Open` → free text.
  - `Choice: a | b | c` → clickable options (max 4); the designer can always type something else. `(multi)` = several allowed.
  - `→ then` = follow-up open question when a given option is picked.
- Never more than 4 clickable questions at once; ask open questions one by one.
- **D1 (design file)** is never mandatory. Files are stored with the issue by `scripts/add-design.sh` (`designs/<n>-<slug>/` on the feature branch); a file answers many questions by itself: read it and skip what it answers.
- Before asking for a new feature, check if it is only **content** (a new project, a text change, a new page with existing layout): then explain how to do it in the admin (`docs/designer-guide.md`) instead of creating an issue.

## All types

| #   | Question                               | Level       | Answer                                                                                                 |
| --- | -------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------ |
| A0  | Quel type de demande ?                 | Must        | Choice: Nouvelle fonctionnalité · Bug · Améliorer l'existant · Performance (Other → chore)             |
| A1  | En une phrase : de quoi as-tu besoin ? | Must        | Open                                                                                                   |
| A2  | Pour qui ?                             | Must        | Choice (multi): Visiteurs (clients, recruteurs) · Moi dans l'admin · Les deux                          |
| A3  | Pourquoi maintenant ?                  | If relevant | Open                                                                                                   |
| A4  | Une échéance ?                         | If relevant | Choice: Pas d'échéance · Cette semaine · Ce mois-ci · Date précise → then: laquelle / quel événement ? |
| D1 | As-tu un fichier de design ? (zip exporté d\'un outil ou de Claude, page HTML, captures PNG, PDF) | If relevant (always for UI) | Choice: Oui, je le glisse ici · Un lien (Figma…) · Non → then: le fichier ou le lien |

## Feature

| #   | Question                                                                                                         | Level       | Answer                                                                                                                                 |
| --- | ---------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | Quel problème ça résout ? Comment fais-tu aujourd'hui ?                                                          | Must        | Open                                                                                                                                   |
| F2  | Décris le parcours : le visiteur arrive… voit… clique…                                                           | Must        | Open                                                                                                                                   |
| F3  | Comment saura-t-on que c'est fini ? Liste ce qui doit être vrai (chaque point devient un critère d'acceptation). | Must        | Open                                                                                                                                   |
| F4 | (si pas de fichier en D1) Comment imagines-tu le rendu ? Une référence ? | Must if UI | Open |
| F5  | Où ça apparaît ?                                                                                                 | Must        | Choice (multi): Accueil · Page projet · Une page (à propos…) · Nouvelle page → then: laquelle / quelle URL ?                           |
| F6  | Le contenu doit-il être modifiable dans l'admin ?                                                                | Must        | Choice: Oui, je veux le modifier moi-même · Non, c'est fixe · Je ne sais pas → then (Oui): quels champs (texte, image, lien, liste…) ? |
| F7  | Comportement sur mobile ?                                                                                        | Must if UI  | Choice: Identique, adapté · Différent → then: comment ?                                                                                |
| F8  | Qu'est-ce qui ne fait explicitement **pas** partie de la demande ?                                               | Must        | Open                                                                                                                                   |
| F9  | Animation ou interaction particulière ?                                                                          | If relevant | Choice: Aucune · Oui → then: laquelle (référence, vidéo) ?                                                                             |
| F10 | Service externe ? (formulaire, newsletter, analytics, calendrier…)                                               | If relevant | Choice: Aucun · Oui → then: lequel ?                                                                                                   |

## Bug

| #   | Question                                                                 | Level          | Answer                                                                                  |
| --- | ------------------------------------------------------------------------ | -------------- | --------------------------------------------------------------------------------------- |
| B1  | Qu'as-tu fait, étape par étape ?                                         | Must           | Open                                                                                    |
| B2  | Qu'attendais-tu ?                                                        | Must           | Open                                                                                    |
| B3  | Que s'est-il passé à la place ? (message d'erreur exact si il y en a un) | Must           | Open                                                                                    |
| B4  | Où ?                                                                     | Must           | Choice: Site en ligne · Preview d'une PR · Admin · En local → then: quelle page / URL ? |
| B5  | Sur quel appareil ?                                                      | Must if visual | Choice: Ordinateur · Mobile · Tablette → then: quel navigateur ?                        |
| B6  | À quelle fréquence ?                                                     | Must           | Choice: À chaque fois · Parfois · Une seule fois                                        |
| B7  | Capture d'écran ou vidéo ?                                               | If relevant    | Choice: Non · Oui → then: lien                                                          |

## Improvement

| #   | Question                                                      | Level       | Answer                                   |
| --- | ------------------------------------------------------------- | ----------- | ---------------------------------------- |
| I1  | Que fait le site aujourd'hui ?                                | Must        | Open                                     |
| I2  | Que devrait-il faire à la place ? (maquette bienvenue)        | Must        | Open                                     |
| I3  | Qu'est-ce que ça change pour le visiteur ou pour toi ?        | Must        | Open                                     |
| I4  | Comment saura-t-on que c'est fini ?                           | Must        | Open                                     |
| I5  | Le contenu concerné doit-il devenir modifiable dans l'admin ? | If relevant | Choice: Non · Oui → then: quels champs ? |

## Performance

| #   | Question                                                              | Level | Answer |
| --- | --------------------------------------------------------------------- | ----- | ------ |
| P1  | Quelle page ou action est lente ?                                     | Must  | Open   |
| P2  | À quel point, mesuré comment ? (secondes, score Lighthouse, appareil) | Must  | Open   |
| P3  | Qu'est-ce qui serait acceptable ?                                     | Must  | Open   |

## Chore

| #   | Question                              | Level | Answer |
| --- | ------------------------------------- | ----- | ------ |
| C1  | Quoi et pourquoi ?                    | Must  | Open   |
| C2  | Comment vérifie-t-on que c'est fait ? | Must  | Open   |

## Options (always last, one clickable batch — `/request` only)

| #   | Question                                           | Answer                                                         |
| --- | -------------------------------------------------- | -------------------------------------------------------------- |
| O1  | Valider le plan technique avant le développement ? | Choice: Non · Oui                                              |
| O2  | Qui développe ?                                    | Choice: Agent (automatique) · Moi avec /build · Un développeur |
| O3  | Lancer maintenant ou garder en brouillon ?         | Choice: Lancer maintenant · Garder en brouillon                |

O2 mapping: Agent → `Implementer: agent`; Moi avec /build or Un développeur → `Implementer: human`.
