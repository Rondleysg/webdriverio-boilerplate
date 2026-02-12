# AGENTS.md – Guidance for AI agents

This repo is a **QA test automation** project using **WebdriverIO** (browser + native app via Appium) and **TypeScript**. Follow the conventions below; detailed docs are in [docs/](docs/).

---

## Commands

Run these from the project root:

| Command | Description |
|---------|-------------|
| `npm run test-android` | Run tests on Android (emulator/device) + browser (Chrome) |
| `npm run test-ios` | Run tests on iOS (simulator/device) + browser |
| `npm run test-android-headless` | Run Android tests with browser in headless mode |
| `npm run test-ios-headless` | Run iOS tests with browser in headless mode |
| `npm run build` | TypeScript check (`tsc --noEmit`) |
| `wdio run ./configs/wdio.android.conf.ts` | Run with Android config (optional `--headless`) |
| `wdio run ./configs/wdio.ios.conf.ts` | Run with iOS config |

**Details:** [docs/09-comandos-e-opcoes.md](docs/09-comandos-e-opcoes.md).

---

## Stack

- **Runtime:** Node.js
- **Test runner:** WebdriverIO (wdio) with Mocha
- **Language:** TypeScript, strict mode
- **Config:** `configs/wdio.shared.conf.ts` (base), `wdio.android.conf.ts`, `wdio.ios.conf.ts`; baseURL and capabilities (multiremote: browser + mobile)
- **App:** Appium (Android UiAutomator2, iOS XCUITest); app path in `configs` and optional env in [lib/env.ts](lib/env.ts)

---

## Project structure (summary)

```
configs/        → wdio.shared.conf.ts, wdio.android.conf.ts, wdio.ios.conf.ts
test/           → specs/**/*.ts, e2e/*.ts (spec files)
pageobjects/    → Page Objects for web (browser)
screenobjects/ → Screen Objects for native app (mobile) + components/
fixtures/       → Reusable functions (e.g. loginFixture); export from index.ts
lib/            → env.ts, data-factory.ts, Utils.ts (getDeviceFromCapabilities, app selectors, reLaunchApp)
test-data/     → e2e/Constants.ts; optional <fluxo>/inputs.json, builder.ts
apps/           → App binaries (APK, IPA) or placeholder
docs/           → Full documentation (one file per topic)
```

See [docs/02-estrutura-de-diretórios.md](docs/02-estrutura-de-diretórios.md) for the role of each directory.

---

## Conventions (do / don't)

### Imports in specs

- **Do:** Import `expect` from `@wdio/globals`. Use `getDeviceFromCapabilities('browser')` or `getDeviceFromCapabilities('mobile')` from [lib/Utils.ts](lib/Utils.ts) to get the session.
- **Don't:** Rely on global `driver`/`browser` without importing from `@wdio/globals` when types are needed; use `lib/Utils` for device access.

### Test data

- **Do:** Put static inputs in `test-data/<fluxo>/inputs.json` (or `.ts`). Use [lib/data-factory.ts](lib/data-factory.ts) for generated data; optional per-flow builders in `test-data/.../builder.ts`. Use `test-data/e2e/Constants.ts` for app constants (BUNDLE_ID, PACKAGE_NAME).
- **Don't:** Hardcode large or reusable payloads inside spec files.

### Naming and layout

- **Do:** Place specs in `test/specs/` or `test/e2e/` (paths configurable in `configs/wdio.shared.conf.ts`). Use descriptive test names (scenario + expected outcome). Prefer Arrange–Act–Assert.
- **Do:** Use Page Objects for web and Screen Objects for app; use `lib/Utils` for multiremote access and native selectors (getElementByTestIDApp, etc.).

### Allure Reporter

- **Do:** Use Allure for elaborated reports: import `allureReporter` from `@wdio/allure-reporter`. **Estrutura:** `addEpic` (macro área), `addFeature` (funcionalidade), `addStory` (user story) em `beforeEach`; **steps:** `allureReporter.step('nome', async () => { ... })`. Quando fizer sentido: **addSeverity** (criticidade), **addTag** (smoke/regression/e2e), **addAttachment** (evidências), **addIssue**/ **addTestId** (Jira/TMS), **addArgument** (parâmetros para debug). Tabela "API Allure – quando usar" em [docs/10-allure-reporter.md](docs/10-allure-reporter.md). Config em [configs/wdio.shared.conf.ts](configs/wdio.shared.conf.ts).

### Environment

- **Do:** Override via `.env` (see [.env.example](.env.example)); config uses `dotenv/config`. Use `lib/env` when baseURL or URLs need to be read from env.
- **Don't** commit `.env` or secrets.

---

## Adding new work

| Task | Where to look / what to do |
|------|----------------------------|
| **New test (browser or app)** | [docs/06-como-adicionar-novo-teste.md](docs/06-como-adicionar-novo-teste.md) — import `expect` from `@wdio/globals`, use Page Objects / Screen Objects or `getDeviceFromCapabilities`, optionally test-data. |
| **New flow** | [docs/07-como-adicionar-novo-fluxo.md](docs/07-como-adicionar-novo-fluxo.md) — create `test/specs/<fluxo>/` or use `test/e2e/`, optionally `test-data/<fluxo>/`, then add specs. |
| **New fixture** | [docs/03-fixtures.md](docs/03-fixtures.md) — add function in [fixtures/index.ts](fixtures/index.ts) and export. |
| **New inputs or builders** | [docs/04-test-data.md](docs/04-test-data.md) — add or edit `test-data/.../inputs.json` or `builder.ts`; use [lib/data-factory.ts](lib/data-factory.ts) for random data. |
| **Env / config** | [docs/08-ambiente-e-configuração.md](docs/08-ambiente-e-configuração.md) — variables, `.env`, and [configs/wdio.shared.conf.ts](configs/wdio.shared.conf.ts). |

---

## Key files

| File | Purpose |
|------|---------|
| [configs/wdio.shared.conf.ts](configs/wdio.shared.conf.ts) | Base config: specs, baseURL, Mocha, reporters (Allure), hooks (before, afterTest screenshots, onComplete Allure report). |
| [configs/wdio.android.conf.ts](configs/wdio.android.conf.ts) | Multiremote capabilities (browser + mobile Android). |
| [configs/wdio.ios.conf.ts](configs/wdio.ios.conf.ts) | Multiremote capabilities (browser + mobile iOS). |
| [fixtures/index.ts](fixtures/index.ts) | Reusable fixtures (e.g. loginFixture). |
| [lib/Utils.ts](lib/Utils.ts) | getDeviceFromCapabilities, app selectors, reLaunchApp. |
| [lib/env.ts](lib/env.ts) | Env-based URLs when used. |
| [lib/data-factory.ts](lib/data-factory.ts) | randomString, randomEmail, randomNumber. |
| [tsconfig.json](tsconfig.json) | TypeScript config; paths for `@wdio/globals` if needed. |

---

## Boundaries

- **Don't** commit `.env` or secrets; only reference `.env.example`.
- **Don't** change the default configs (shared, android, ios) without aligning docs and AGENTS.md.
- When adding a new flow, follow the existing layout: `test/specs/<fluxo>/` or `test/e2e/`, and, if needed, `test-data/<fluxo>/`.

---

## QA agents (WebdriverIO)

Este projeto usa agentes de QA especializados em **WebdriverIO**. Use-os para manter convenções, adicionar testes/fluxos/dados/fixtures ou revisar código.

| Agent | When to use |
|-------|-------------|
| **agt-qa-webdriverio-context** | Dúvidas sobre estrutura, comandos, documentação (não edita código). |
| **agt-qa-webdriverio-maintain** | Editar specs ou refatorar alinhado às convenções do projeto. |
| **agt-qa-webdriverio-add-test** | Adicionar um novo teste (browser, app ou E2E). |
| **agt-qa-webdriverio-add-flow** | Adicionar um novo fluxo (pastas, specs, test-data). |
| **agt-qa-webdriverio-add-fixture** | Adicionar ou estender fixture em `fixtures/index.ts`. |
| **agt-qa-webdriverio-add-data** | Adicionar ou estender test-data (inputs.json, builder.ts). |
| **agt-qa-webdriverio-code-reviewer** | Revisar código QA (specs, test-data, fixtures) e gerar resumo de melhorias. |

Skills correspondentes em [.cursor/skills/qa/](.cursor/skills/qa/): `skill-qa-webdriverio-maintain-conventions`, `skill-qa-webdriverio-add-fixture`, `skill-qa-webdriverio-add-new-flow`, `skill-qa-webdriverio-add-new-test`, `skill-qa-webdriverio-add-test-data`, `skill-qa-webdriverio-code-review`.

---

## Full documentation

Human-readable docs (structure, fixtures, test-data, lib, how to add tests/flows, env, commands) are in [docs/](docs/). Index: [docs/README.md](docs/README.md).
