# Repo Conventions

- Do not add tests for config schemas or config service accessors unless there is non-trivial logic worth validating.
- Use British spelling in new identifiers, comments, and docs unless constrained by external APIs/contracts.
- Prefer `Taskfile.yml` tasks for repository utility scripts instead of adding root `package.json` scripts.
- Keep generated script artefacts under `scripts/<domain>/data/` so executable scripts and generated data stay separate.
