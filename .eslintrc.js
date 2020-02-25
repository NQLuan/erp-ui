module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: [
        'prettier',
        'prettier/vue',
        'plugin:prettier/recommended',
        '@nuxtjs',
        'plugin:nuxt/recommended'
    ],
    plugins: [
        'prettier'
    ],
    rules: {
        // Rules custom
        'nuxt/no-cjs-in-config': 'off',
        'no-console': 1, // set 1 (warning) if development default 2 (error)
        'no-debugger': 1, // set 1 (warning) if development default 2 (error)
        'id-match': [1,
            // '(^[A-Za-z]+(?:[A-Z][a-z]*)*\d*$)|(^[A-Z]+(_[A-Z]+)*(_\d$)*$)|(^(_|\$)$)'
            // TODO update here not work for format $axios
            '^(\$[a-z]|[a-z])+(_[a-z]+)*$',
            {
                'properties': true,
                'ignoreDestructuring': false,
                'onlyDeclarations': true
            }
        ],
        'indent': [2, 4, {
            'SwitchCase': 1
        }],
        'space-before-function-paren': [2, 'never'],

        // Rules of vueJS
        "vue/name-property-casing": 0,
        "vue/html-indent": [2, 4, {
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }],
        "vue/html-self-closing": [2, {
            "html": {
                "void": "always",
                "normal": "always",
                "component": "always"
            },
            "svg": "always",
            "math": "always"
        }],
        "vue/max-attributes-per-line": [2, {
            "singleline": 20,
            "multiline": {
                "max": 1,
                "allowFirstLine": false
            }
        }],
        // Rules of prettier
        'prettier/prettier': ['error', {
            htmlWhitespaceSensitivity: 'ignore',
            semi: false,
            singleQuote: true,
            tabWidth: 4,
            useTabs: false,
            printWidth: 150
        }],
    }
}
