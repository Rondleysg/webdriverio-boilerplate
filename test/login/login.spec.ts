import { expect } from '@wdio/globals'
import allureReporter from '@wdio/allure-reporter'
import LoginPage from '../../pageobjects/LoginPage'
import SecurePage from '../../pageobjects/SecurePage'
import inputs from '../../test-data/login/inputs.json'
import messages from '../../test-data/login/messages.json'
import TabBar from 'screenobjects/components/TabBar'
import LoginScreen from 'screenobjects/LoginScreen'
import NativeAlert from 'screenobjects/components/NativeAlert'
import { getDeviceFromCapabilities } from 'lib/Utils'
import { reLaunchApp } from 'fixtures'
import HomeScreen from 'screenobjects/HomeScreen'

describe('Open mobile and browser instances and perform actions in both within the same test', () => {
    beforeEach(() => {
        allureReporter.addEpic('Autenticação');
        allureReporter.addFeature('Login web e app');
        allureReporter.addStory('Login com usuário válido');
        allureReporter.addSeverity('blocker');
        allureReporter.addDescription('Este teste verifica se o login funciona corretamente no browser e no app.');
        allureReporter.addLabel('layer', 'e2e')
        allureReporter.addTag('login')
    })

    async function loginInBrowser() {
        await LoginPage.open()
        await LoginPage.login(inputs.login.browser.username, inputs.login.browser.password)
        await expect(SecurePage.flashAlert).toBeExisting()
        await expect(SecurePage.flashAlert).toHaveText(expect.stringContaining(messages.loginSuccessMessage))
    }

    async function loginInApp() {
        await TabBar.waitForTabBarShown()
        await TabBar.openLogin()
        await LoginScreen.waitForIsShown(true)
        await LoginScreen.tapOnLoginContainerButton()
        await LoginScreen.submitLoginForm({ username: inputs.login.app.username, password: inputs.login.app.password })
        await NativeAlert.waitForIsShown()
        await expect(await NativeAlert.text()).toContain('Success')
        await NativeAlert.topOnButtonWithText('OK')
        await NativeAlert.waitForIsShown(false)
    }

    it('Perform login in both browser and mobile app sequentially', async () => {
        allureReporter.addArgument('usernameBrowser', inputs.login.browser.username);
        allureReporter.addArgument('passwordBrowser', inputs.login.browser.password);
        allureReporter.addArgument('usernameApp', inputs.login.app.username);
        allureReporter.addArgument('passwordApp', inputs.login.app.password);

        await allureReporter.step('Login no browser', async () => {
            await loginInBrowser()
        })

        await allureReporter.step('Login no app', async () => {
            await loginInApp()
        })
    })

    it('Perform login in both browser and mobile app simultaneously', async () => {
        allureReporter.addArgument('usernameBrowser', inputs.login.browser.username);
        allureReporter.addArgument('passwordBrowser', inputs.login.browser.password);
        allureReporter.addArgument('usernameApp', inputs.login.app.username);
        allureReporter.addArgument('passwordApp', inputs.login.app.password);
        
        const emulator = getDeviceFromCapabilities('mobile')
        const browser = getDeviceFromCapabilities('browser')

        await allureReporter.step('Reload session e reabrir app', async () => {
            await Promise.all([
                browser.reloadSession(),
                reLaunchApp(emulator),
            ])
            await HomeScreen.waitForIsShown(true)
        })

        await allureReporter.step('Login no browser e app em paralelo', async () => {
            await Promise.all([
                loginInBrowser(),
                loginInApp(),
            ])
        })
    })
})
