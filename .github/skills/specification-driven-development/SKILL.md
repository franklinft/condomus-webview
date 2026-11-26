---
name: specification-driven-development
description: Apply the repository's Specification-Driven Development workflow when implementing or changing a feature, behavior, contract, or technical decision.
---

Use this skill when a task changes application behavior, a domain contract, a
user flow, or an architectural decision.

1. Locate the numbered feature under `specs/`.
2. Define the problem, actors, scope, user stories, rules, acceptance criteria,
   and errors in `spec.md`.
3. Mark unresolved requirements as `[NEEDS CLARIFICATION]` and resolve them
   before implementation.
4. Create or update `plan.md`, `data-model.md`, `contracts/`, and
   `quickstart.md` when they apply.
5. Break the plan into dependency-ordered tasks in `tasks.md`.
6. Implement the smallest change that satisfies the specification.
7. Keep page or container code responsible for service orchestration and pass
   data, states, and callbacks to visual components.
8. Update all related artifacts after implementation.
9. Run the validation commands defined by the feature. For this project, run
   `npm run lint` and `npm run build` from `app/` using Node.js 20.9 or newer.
10. Report documentation changes, validation results, warnings, and unresolved
    decisions.

Do not treat the task as complete while the specification and implementation
disagree.
