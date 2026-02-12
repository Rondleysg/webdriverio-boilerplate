# Allure Reporter

O projeto usa **Allure** para relatórios de execução. O reporter está configurado em [configs/wdio.shared.conf.ts](../configs/wdio.shared.conf.ts); os resultados ficam em `allure-results` e o relatório é gerado ao final da execução (`onComplete`).

## Abrindo o relatório

Após rodar os testes:

```bash
npx allure generate allure-results --clean
npx allure open
```

O primeiro comando gera o relatório em `allure-report`; o segundo abre no navegador. O config já chama `allure generate` no hook `onComplete`, então basta `npx allure open` se a geração tiver sido feita na mesma pasta.

## Uso no projeto

Para relatórios mais ricos, use a API do Allure nos specs:

- **Labels:** organizam os testes no Allure (epic, feature, story).
- **Steps:** quebram o teste em passos lógicos; em falha, fica claro em qual passo quebrou.

### Import

```ts
import allureReporter from '@wdio/allure-reporter'
```

### Epic, Feature e Story (estrutura)

- **addEpic** — nível mais alto de agrupamento (macro área do sistema; ex.: "Plataforma Web").
- **addFeature** — funcionalidade dentro do Epic (ex.: "Autenticação").
- **addStory** — user story; mapeia para Jira/backlog (ex.: "Login com usuário válido").

Defina no nível da suite (por exemplo em `beforeEach`) para que cada teste herde os labels:

```ts
beforeEach(() => {
    allureReporter.addEpic('Plataforma Web')
    allureReporter.addFeature('Autenticação')
    allureReporter.addStory('Login com usuário válido')
})
```

### Steps

Envolva blocos lógicos em `allureReporter.step()`:

```ts
it('login no browser e no app em sequência', async () => {
    await allureReporter.step('Login no browser', async () => {
        await LoginPage.open()
        await LoginPage.login(user, pass)
        await expect(SecurePage.flashAlert).toBeExisting()
    })
    await allureReporter.step('Login no app', async () => {
        await TabBar.openLogin()
        await LoginScreen.submitLoginForm({ username: user, password: pass })
        await expect(NativeAlert.text()).toContain('Success')
    })
})
```

### Classificação

- **addSeverity(value)** — criticidade do teste; ajuda a priorizar falhas no report. Valores: `trivial`, `minor`, `normal`, `critical`, `blocker`. Use em testes críticos (ex.: login, pagamento).
- **addTag(value)** — tag para filtrar no report (ex.: `smoke`, `regression`, `e2e`). Use para identificar tipo de suite ou cenário.

### Evidência

- **addAttachment(name, content, type)** — anexa arquivo ao teste. Use para: screenshots customizados, logs, JSON de resposta, HTML. Tipos comuns: `image/png`, `application/json`, `text/plain`, `text/html`. O config já anexa screenshots de mobile e browser em falha; use para evidências adicionais ou em passos específicos.

### Integração

- **addIssue(value)** — vincula o teste a um bug/issue (ex.: `BUG-123`, `PROJ-456`). Use quando o teste cobre ou reproduz um ticket; no report o link aparece se `issueLinkTemplate` estiver configurado no reporter.
- **addTestId(value)** — associa ao ID de caso de teste externo (TestRail, Zephyr, etc.). Ex.: `TC-LOGIN-01`. Use quando houver rastreabilidade com TMS; o link aparece se `tmsLinkTemplate` estiver configurado.

### Contexto

- **addArgument(name, value)** — adiciona parâmetro ao teste no report (ex.: email usado, ambiente). Use para registrar dados da execução e facilitar debug. Ex.: `allureReporter.addArgument('email', 'teste@email.com')`.

## Exemplo mínimo

```ts
import { expect } from '@wdio/globals'
import allureReporter from '@wdio/allure-reporter'
import LoginPage from '../pageobjects/LoginPage'

describe('Login', () => {
    beforeEach(() => {
        allureReporter.addEpic('Login')
        allureReporter.addFeature('Login web')
    })

    it('deve fazer login com sucesso', async () => {
        await allureReporter.step('Abrir página e preencher credenciais', async () => {
            await LoginPage.open()
            await LoginPage.login('user', 'pass')
        })
        await allureReporter.step('Verificar mensagem de sucesso', async () => {
            await expect(LoginPage.message).toHaveText(expect.stringContaining('Welcome'))
        })
    })
})
```

## API Allure – quando usar

| Função | Categoria | Quando usar |
|--------|-----------|-------------|
| **addEpic(value)** | Estrutura | Nível mais alto: macro área do sistema (ex.: "Plataforma Web", "App Mobile"). |
| **addFeature(value)** | Estrutura | Funcionalidade dentro do Epic (ex.: "Autenticação", "Checkout"). |
| **addStory(value)** | Estrutura | User story; mapeia para Jira/backlog (ex.: "Login com usuário válido"). |
| **addSeverity(value)** | Classificação | Criticidade: `trivial`, `minor`, `normal`, `critical`, `blocker`. Prioriza falhas no report. |
| **addTag(value)** | Classificação | Filtro no report: `smoke`, `regression`, `e2e`, etc. |
| **addAttachment(name, content, type)** | Evidência | Screenshots, logs, JSON, HTML; tipos: `image/png`, `application/json`, `text/plain`, `text/html`. |
| **addIssue(value)** | Integração | Vincula a bug/issue (ex.: `BUG-123`); requer `issueLinkTemplate` no config. |
| **addTestId(value)** | Integração | ID de caso de teste externo (ex.: `TC-LOGIN-01`); requer `tmsLinkTemplate` no config. |
| **addArgument(name, value)** | Contexto | Parâmetros da execução no report (ex.: email, ambiente) para debug. |

Além disso: **step(name, body)** — quebra o teste em passos lógicos; em falha, o report mostra em qual passo falhou.

## Referência

- [Allure Reporter | WebdriverIO](https://webdriver.io/docs/allure-reporter) — API completa (labels, steps, attachments, config).
