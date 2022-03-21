module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "babel"
    ],
    "rules": {
        "react/prop-types": 0,
        "react/no-unescaped-entities": 0,
        "react/display-name": 0,
        "no-unused-vars": ["warn", { "argsIgnorePattern": "^_$" }],
        "no-unreachable": 1,
        "no-console": 0,
        "no-trailing-spaces": 1,
        // "indent": [
        //     "error",
        //     2
        // ],
        // "linebreak-style": [
        //     "error",
        //     "unix"
        // ],
        // "quotes": [
        //     "error",
        //     "double"
        // ],
        // "semi": [
        //     "error",
        //     "never"
        // ]
    },
    "globals": {
        "process": false,
        "__dirname": false,
        "RECAPTCHA_SITE_KEY": false,
        "t": false,
    }
};