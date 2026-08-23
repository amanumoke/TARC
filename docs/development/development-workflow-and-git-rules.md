# TARCMS Conflict-Free Development Workflow & Git Governance

> **Document Status**: Mandatory Engineering Standard  
> **Target Audience**: All Contributing Developers and AI Agentic Workers

---

## 1. Core Git Branching Rules & Constraints

### Rule 1: Protected Main Branch — Zero Direct Commits
- The `main` branch is protected and contains strictly production-ready, passing code.
- **NEVER push directly to `main`**.
- All additions and modifications must arrive via a Pull Request (PR) from a dedicated branch.

---

### Rule 2: Dedicated Branch Per Phase / Feature / Bugfix
Every discrete piece of work must be developed on its own dedicated branch created from the latest `main`.

#### Branch Naming Convention:
| Type | Pattern | Examples |
| :--- | :--- | :--- |
| **Phase Work** | `feat/phase-<number>-<description>` | `feat/phase-01-monorepo-foundation`, `feat/phase-02-database-schema` |
| **Feature Work** | `feat/<domain>-<description>` | `feat/publications-pdf-upload`, `feat/vehicles-assignment-flow` |
| **Bug Fixes** | `fix/<domain>-<issue>` | `fix/staff-department-cascade`, `fix/contact-form-email-validation` |
| **Refactoring** | `refactor/<domain>-<description>` | `refactor/drizzle-query-adapters`, `refactor/auth-context-hooks` |
| **Documentation** | `docs/<topic>` | `docs/deployment-guide-updates`, `docs/api-contracts` |

```bash
# Example: Creating a dedicated branch for Phase 1
git checkout main
git pull origin main
git checkout -b feat/phase-01-monorepo-foundation
```

---

## 2. Pre-Push Quality Gate: Mandatory Local CI Verification

Before pushing ANY branch or commit to GitHub, you **MUST execute the full validation pipeline locally**.

We define a dedicated root command in `package.json`:
```json
"scripts": {
  "validate": "npm run lint && npm run typecheck && npm run test && npm run build"
}
```

### The 4-Step Pre-Push Checklist:
- [ ] **1. Linting & Formatting**: `npm run lint` (Biome check must pass with 0 errors).
- [ ] **2. Type Safety**: `npm run typecheck` (`tsc --noEmit` must pass with 0 errors).
- [ ] **3. Test Suites**: `npm run test` (All Vitest unit & integration tests must pass 100%).
- [ ] **4. Build Check**: `npm run build` (Ensures shared, server, and client bundle cleanly).

```bash
# Run the all-in-one pre-push validation script
npm run validate
```

> **CRITICAL RULE**: If `npm run validate` fails on even a single test or lint warning, **DO NOT PUSH**. Fix the failure locally first.

---

## 3. Conflict-Free Git Lifecycle Workflow

To completely prevent merge conflicts and messy merge commits:

```
                  [ main branch (clean, passing) ]
                                 │
                 git checkout -b feat/my-feature
                                 │
                     [ Local Feature Commits ]
                                 │
                     git pull --rebase origin main  <--- Sync latest changes cleanly
                                 │
                       npm run validate             <--- Mandatory local check
                                 │
                     git push origin feat/my-feature
                                 │
                     [ GitHub Pull Request ]
                                 │
                    [ Automated GitHub CI Pass ]
                                 │
                 Squash & Merge into main (or Rebase)
```

### Step-by-Step Command Workflow:

1. **Keep branch fresh against main**:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Commit with Conventional Commits Standard**:
   ```bash
   git add .
   git commit -m "feat(publications): add multi-author junction mapping and PDF storage"
   ```
   **Commit Type Prefixes**:
   - `feat:` New feature or capability.
   - `fix:` Bug fix.
   - `test:` Adding or updating tests.
   - `refactor:` Code restructuring without functional change.
   - `docs:` Documentation additions or edits.
   - `chore:` Dependency updates, workspace configuration.

3. **Validate locally**:
   ```bash
   npm run validate
   ```

4. **Push your dedicated branch**:
   ```bash
   git push -u origin feat/my-feature
   ```

5. **Open Pull Request**:
   - Title matches commit convention (`feat(phase-1): initialize monorepo and CI`).
   - GitHub Actions CI automatically triggers and verifies all checks.
   - Merge into `main` once CI is green.

---

## 4. GitHub Actions CI Enforcement Rules

The `.github/workflows/ci.yml` workflow enforces the exact same checks on GitHub:

```yaml
# Pipeline Stages in GitHub Actions:
1. Lint & Format (Biome check)
2. TypeScript Check (tsc across all workspaces)
3. Vitest Test Runner (Shared, Server, and Web test suites)
4. Build Step (Vite build + Server compilation)
```

- **Branch Protection Setting on GitHub**:
  - *Require status checks to pass before merging*: `quality-gate` (enforced).
  - *Require branches to be up to date before merging*: Enabled.
  - *Include administrators*: Enabled.
