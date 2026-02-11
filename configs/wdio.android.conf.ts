import {
    getAndroidDeviceName,
    getAndroidPlatformVersion,
    getAppPath,
} from 'lib/env';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { config } = require('./wdio.shared.conf');

const headless = process.argv.includes('--headless');

const browserOptions = {
    args: [
        '--start-maximized',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-infobars',
        '--window-size=1366,768',
        '--disable-setuid-sandbox',
        '--remote-debugging-port=9515',
        '--disable-software-rasterizer',
        '--disable-gpu-sandbox',
        '--no-first-run',
        '--disable-sync',
        '--disable-extensions',
    ],
};

if (headless) {
    browserOptions.args.push('--headless=new');
}

const browserCap = {
    browserName: 'chrome',
    'goog:chromeOptions': browserOptions,
};

const androidAppPath = getAppPath();
const androidDeviceName = getAndroidDeviceName();
const androidPlatformVersion = getAndroidPlatformVersion();

const androidCap = {
    'appium:platformName': 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:orientation': 'PORTRAIT',
    'appium:deviceName': androidDeviceName,
    'appium:platformVersion': androidPlatformVersion,
    'appium:app': androidAppPath,
    'appium:appWaitActivity': '*',
    'appium:noReset': true,
    'appium:autoGrantPermissions': true,
    'appium:deviceType': 'phone',
};

config.capabilities = {
    mobile: {
        protocol: 'http',
        hostname: 'localhost',
        port: 4723,
        path: '/',
        capabilities: androidCap,
    },
    browser: {
        automationProtocol: 'webdriver',
        capabilities: browserCap,
    },
};

config.services = [
    [
        'appium',
        {
            command: 'appium',
        },
    ],
];

exports.config = config;
