# Fixtures

No contexto deste projeto WebdriverIO, **fixtures** são funções reutilizáveis exportadas de `fixtures/index.ts` que encapsulam ações comuns (ex.: reiniciar o app).

## O que existe hoje

**Arquivo:** `fixtures/index.ts`

- **reLaunchApp(emulator)**: recebe a instância do dispositivo/emulador (WebdriverIO). Encerra e reabre o app usando os identificadores em `test-data/Constants` (BUNDLE_ID para iOS, PACKAGE_NAME para Android). Útil entre cenários ou para garantir estado limpo antes de um teste.

Uso nos specs: importar de `fixtures` e chamar passando a sessão mobile (ex.: `getDeviceFromCapabilities('mobile')`).

## Por que usar fixtures

- **Reuso**: um único lugar para ações repetidas (ex.: reLaunchApp), evitando duplicar passos em vários testes.
- **Manutenção**: alterações (ex.: identificadores do app em Constants) são feitas em um só lugar.

## Como adicionar uma nova fixture

1. Abra `fixtures/index.ts`.
2. Crie uma função async que receba pelo menos a instância do browser/app (tipo `Browser` de `webdriverio`).
3. Exporte a função (ou adicione ao export existente).

### Exemplo: uso de reLaunchApp no spec

```ts
import { getDeviceFromCapabilities } from 'lib/Utils'
import { reLaunchApp } from 'fixtures'

describe('Meu fluxo', () => {
    it('reinicia o app e executa login', async () => {
        const emulator = getDeviceFromCapabilities('mobile')
        await reLaunchApp(emulator)
        // ... passos de login no app
    })
})
```

### Exemplo: adicionar uma fixture de login no app

```ts
// fixtures/index.ts
export async function loginFixture(browser: WebdriverIO.Browser) {
    // Ex.: preencher campos e clicar em login; esperar home
    const emailInput = await browser.$('~email-input')
    const passwordInput = await browser.$('~password-input')
    await emailInput.setValue('teste@exemplo.com')
    await passwordInput.setValue('123456')
    await browser.$('~login-button').click()
    await browser.$('~home-screen').waitForDisplayed()
}
```

## Regra para os specs

- Para asserções, importar `expect` de `@wdio/globals`.
- Para acessar browser ou app no multiremote, usar `getDeviceFromCapabilities('browser')` ou `getDeviceFromCapabilities('mobile')` de `lib/Utils`.
- Para fluxos prontos (ex.: login), importar e chamar as funções de `fixtures/`.
