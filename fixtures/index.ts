import { BUNDLE_ID, PACKAGE_NAME } from '../test-data/Constants'

export async function reLaunchApp(emulator: WebdriverIO.Browser) {
    const identifier = emulator.isAndroid ? PACKAGE_NAME : BUNDLE_ID

    const appIdentifier = {
        [emulator.isAndroid ? 'appId' : 'bundleId']: identifier,
    }
    const terminateCommand = 'mobile: terminateApp'
    const launchCommand = `mobile: ${
        emulator.isAndroid ? 'activateApp' : 'launchApp'
    }`

    await emulator.execute(terminateCommand, appIdentifier)
    await emulator.execute(launchCommand, appIdentifier)
}