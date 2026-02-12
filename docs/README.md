# Documentação QA WebdriverIO

Documentação do projeto de automação de testes com **WebdriverIO** (browser + app nativo via Appium). Um arquivo por seção: visão geral, diretórios, fixtures, test-data, lib, como adicionar teste/fluxo, ambiente e comandos.

| Arquivo | Conteúdo |
|---------|----------|
| [01-visao-geral.md](01-visao-geral.md) | Objetivos, fluxo de uso e índice da documentação |
| [02-estrutura-de-diretórios.md](02-estrutura-de-diretórios.md) | Papel de cada diretório (configs, test, pageobjects, screenobjects, fixtures, lib, test-data, apps) |
| [03-fixtures.md](03-fixtures.md) | Fixtures como funções reutilizáveis (ex.: loginFixture); como adicionar uma nova |
| [04-test-data.md](04-test-data.md) | Inputs estáticos, constantes e builders; estrutura test-data (Constants.ts e por fluxo) |
| [05-lib.md](05-lib.md) | lib/env.ts, lib/data-factory.ts e lib/Utils.ts (getDeviceFromCapabilities, seletores app); reLaunchApp em fixtures |
| [06-como-adicionar-novo-teste.md](06-como-adicionar-novo-teste.md) | Exemplos de novo teste no browser, no app e E2E (browser + app) |
| [07-como-adicionar-novo-fluxo.md](07-como-adicionar-novo-fluxo.md) | Checklist e passos para um novo fluxo (specs, test-data, config) |
| [08-ambiente-e-configuração.md](08-ambiente-e-configuração.md) | Variáveis de ambiente, .env, configs WebdriverIO |
| [09-comandos-e-opcoes.md](09-comandos-e-opcoes.md) | Comandos (test-android, test-ios, headless) e opções de execução |
| [10-allure-reporter.md](10-allure-reporter.md) | Allure: abrir relatório, epic/feature/story, steps, exemplo e referência |
