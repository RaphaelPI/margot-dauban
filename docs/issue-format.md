# Issue format

Questions that produce these sections: `docs/intake-questions.md`. Sections are `### Heading` (what GitHub issue forms output). Headings stay in English (agents match them); content is in the designer's language.

The triage agent validates issues against these formats; `/request` and the issue forms produce them.

Optional, any type, right before `### Options` (added by `/request` or `/build` when the designer gives a file):

```markdown
### Design files

`designs/<n>-<slug>/` on branch `feat/<n>-<slug>` — <file: what it shows>
```

Links (Figma, public images) can go there too. The developer works on that branch and treats the files as the visual reference.

Every issue ends with:

```markdown
### Options

- [ ] Validate plan before dev
- [ ] Draft: don't start agents yet

### Implementer

agent
```

## Feature (`type:feature`)

```markdown
### Context / problem

### User story

As a <visitor | recruiter | client | editor>, I want <capability>, so that <benefit>.
### Acceptance criteria

- [ ] Given ..., when ..., then ...
### Out of scope

### Design / content notes

Mockup link (Figma…), where it appears, mobile behaviour, which content the editor manages in the admin.
```

Checklist: audience is named · problem is stated, not only a solution · ≥ 1 testable acceptance criterion · says whether the content is editable in the admin or fixed · desktop/mobile behaviour stated when there is UI · one feature only.

## Bug (`type:bug`)

```markdown
### Steps to reproduce

### Expected

### Actual

### Environment

### Evidence
```

Checklist: reproducible steps (or "intermittent" + frequency) · expected ≠ actual · environment set (production / preview / local) + page URL · device/browser when visual · no secrets in evidence. Acceptance criterion implied: a test reproduces the bug when it is testable, otherwise a "How to test" step.

## Improvement (`type:improvement`)

```markdown
### Current behaviour

### Desired behaviour

### Why / value

### Acceptance criteria
```

Checklist: current behaviour is factual · desired behaviour is concrete (mockup or precise description) · value stated · ≥ 1 testable criterion.

## Performance (`type:perf`)

```markdown
### Where

### Current measurement

### Target
```

Checklist: a number and how it was measured (Lighthouse, Vercel Speed Insights…) · a numeric target · a single page or action.

## Chore (`type:chore`)

```markdown
### What and why

### Done when
```

Checklist: reason stated · verifiable done condition.

## Always rejected

Several unrelated asks (split) · contradictions · untestable criteria ("make it prettier" without a mockup or concrete description) · secrets in the body.
