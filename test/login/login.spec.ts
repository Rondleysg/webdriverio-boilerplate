import { expect } from '@wdio/globals'
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
        await loginInBrowser()
        await loginInApp()
    })

    it('Perform login in both browser and mobile app simultaneously', async () => {
        const emulator = getDeviceFromCapabilities('mobile')
        const browser = getDeviceFromCapabilities('browser')

        await Promise.all([
            browser.reloadSession(),
            reLaunchApp(emulator),
        ])

        await HomeScreen.waitForIsShown(true)

        await Promise.all([
            loginInBrowser(),
            loginInApp(),
        ])
    })
})
