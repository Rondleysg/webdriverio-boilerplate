module.exports = {
    env: {
        node: true,
        es2021: true,
        mocha: true, // Permite usar describe/it sem erros
    },
    extends: [
        'eslint:recommended',
        'plugin:wdio/recommended', // Regras específicas do WebdriverIO
        'prettier', // SEMPRE por último para sobrescrever conflitos
    ],
    plugins: ['wdio'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        // Aqui você pode adicionar regras customizadas
        'no-console': 'warn', // Avisa se você esquecer um console.log
        'wdio/no-pause': 'error', // Proíbe o uso de browser.pause() (má prática)
    },
};
