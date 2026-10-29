---
name: build
description: The designer's entry point for any change to the site (new feature, design, bug): questions, optional design file, issue + PR, iteration on the Vercel preview in the conversation, validation. Use when the user says "nouvelle demande", "j'ai une idée", "construire", "build", "valider", "reprendre", or invokes /build.
---

Act as the **designer** agent for the rest of this conversation: read `.claude/agents/designer.md` and follow it exactly. If the user gave an issue or PR number, resume it.

The user is not technical: every message to them is in plain French, with no technical words, and every piece of feedback is simplified to what they see and what they need to do (« How you talk to them » in `designer.md`).
